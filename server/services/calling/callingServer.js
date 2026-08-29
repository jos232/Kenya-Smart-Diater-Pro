"use strict";

/* ==========================================================
   KENYA SMART DIALER PRO
   APP-TO-APP CALLING SERVER
========================================================== */

const jwt = require("jsonwebtoken");
const User = require("../../models/User");


/* ==========================================================
   ONLINE USERS
   userId -> socketId
========================================================== */

const onlineUsers = new Map();


/* ==========================================================
   NORMALIZE PHONE
========================================================== */

function normalizePhone(phone) {

    if (!phone) return "";

    phone = String(phone).trim();

    if (phone.startsWith("+254")) {

        return "0" + phone.slice(4);

    }

    if (phone.startsWith("254")) {

        return "0" + phone.slice(3);

    }

    return phone;

}


/* ==========================================================
   INITIALIZE CALLING
========================================================== */

function initializeCalling(io) {

    io.on("connection", async (socket) => {

        console.log(
            "Calling socket connected:",
            socket.id
        );


        /* ==================================================
           AUTHENTICATE SOCKET
        ================================================== */

        try {

            const token =
                socket.handshake.auth?.token;

            if (!token) {

                socket.emit(
                    "call:error",
                    {
                        message:
                            "Authentication required."
                    }
                );

                socket.disconnect(true);

                return;

            }


            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );


            const user =
                await User.findById(
                    decoded.userId
                ).select(
                    "_id fullName phone accountStatus"
                );


            if (!user) {

                socket.disconnect(true);

                return;

            }


            if (
                user.accountStatus !==
                "active"
            ) {

                socket.disconnect(true);

                return;

            }


            /* ==============================================
               STORE USER CONNECTION
            ============================================== */

            const userId =
                user._id.toString();

            onlineUsers.set(
                userId,
                socket.id
            );


            socket.user = {

                id: userId,

                fullName:
                    user.fullName,

                phone:
                    user.phone

            };


            console.log(
                "User online:",
                user.fullName,
                user.phone
            );


            socket.emit(
                "call:ready",
                {
                    success: true
                }
            );


            /* ==================================================
               START CALL
            ================================================== */

            socket.on(
                "call:start",
                async (data) => {

                    try {

                        const phone =
                            normalizePhone(
                                data?.phone
                            );


                        if (!phone) {

                            socket.emit(
                                "call:error",
                                {
                                    message:
                                        "Phone number is required."
                                }
                            );

                            return;

                        }


                        /* ======================================
                           FIND RECEIVER
                        ====================================== */

                        const receiver =
                            await User.findOne({
                                phone
                            }).select(
                                "_id fullName phone accountStatus"
                            );


                        if (!receiver) {

                            socket.emit(
                                "call:error",
                                {
                                    message:
                                        "This number is not registered on Kenya Smart Dialer Pro."
                                }
                            );

                            return;

                        }


                        if (
                            receiver.accountStatus !==
                            "active"
                        ) {

                            socket.emit(
                                "call:error",
                                {
                                    message:
                                        "This user's account is not available."
                                }
                            );

                            return;

                        }


                        const receiverId =
                            receiver._id.toString();


                        /* ======================================
                           PREVENT SELF CALL
                        ====================================== */

                        if (
                            receiverId ===
                            userId
                        ) {

                            socket.emit(
                                "call:error",
                                {
                                    message:
                                        "You cannot call your own number."
                                }
                            );

                            return;

                        }


                        /* ======================================
                           CHECK ONLINE
                        ====================================== */

                        const receiverSocketId =
                            onlineUsers.get(
                                receiverId
                            );


                        if (!receiverSocketId) {

                            socket.emit(
                                "call:unavailable",
                                {

                                    phone:
                                        receiver.phone,

                                    message:
                                        "User is currently offline."

                                }
                            );

                            return;

                        }


                        /* ======================================
                           CREATE CALL ID
                        ====================================== */

                        const callId =
                            `${userId}-${receiverId}-${Date.now()}`;


                        /* ======================================
                           SEND INCOMING CALL
                        ====================================== */

                        io.to(
                            receiverSocketId
                        ).emit(
                            "call:incoming",
                            {

                                callId,

                                caller: {

                                    id:
                                        userId,
                                    fullName:
                                        user.fullName,

                                    phone:
                                        user.phone

                                }

                            }
                        );


                        /* ======================================
                           CONFIRM TO CALLER
                        ====================================== */

                        socket.emit(
                            "call:ringing",
                            {

                                callId,

                                receiver: {

                                    id:
                                        receiverId,

                                    fullName:
                                        receiver.fullName,

                                    phone:
                                        receiver.phone

                                }

                            }
                        );


                        console.log(
                            "Call started:",
                            callId
                        );

                    }

                    catch (error) {

                        console.error(
                            "Call start error:",
                            error
                        );

                        socket.emit(
                            "call:error",
                            {
                                message:
                                    "Unable to start call."
                            }
                        );

                    }

                }
            );


            /* ==================================================
               ACCEPT CALL
            ================================================== */

            socket.on(
                "call:accept",
                (data) => {

                    const callerSocketId =
                        findSocketByCallParticipant(
                            data?.callerId
                        );


                    if (!callerSocketId) {

                        socket.emit(
                            "call:error",
                            {
                                message:
                                    "Caller is no longer available."
                            }
                        );

                        return;

                    }


                    io.to(
                        callerSocketId
                    ).emit(
                        "call:accepted",
                        {

                            callId:
                                data.callId,

                            receiver:
                                socket.user

                        }
                    );

                }
            );


            /* ==================================================
               REJECT CALL
            ================================================== */

            socket.on(
                "call:reject",
                (data) => {

                    const callerSocketId =
                        onlineUsers.get(
                            data?.callerId
                        );


                    if (!callerSocketId)
                        return;


                    io.to(
                        callerSocketId
                    ).emit(
                        "call:rejected",
                        {

                            callId:
                                data.callId

                        }
                    );

                }
            );


            /* ==================================================
               END CALL
            ================================================== */

            socket.on(
                "call:end",
                (data) => {

                    const otherUserId =
                        data?.otherUserId;


                    const otherSocketId =
                        onlineUsers.get(
                            otherUserId
                        );


                    if (!otherSocketId)
                        return;


                    io.to(
                        otherSocketId
                    ).emit(
                        "call:ended",
                        {

                            callId:
                                data.callId

                        }
                    );

                }
            );


            /* ==================================================
               WEBRTC SIGNAL
            ================================================== */

            socket.on(
                "call:signal",
                (data) => {

                    const targetUserId =
                        data?.targetUserId;


                    const targetSocketId =
                        onlineUsers.get(
                            targetUserId
                        );


                    if (!targetSocketId)
                        return;


                    io.to(
                        targetSocketId
                    ).emit(
                        "call:signal",
                        {

                            callId:
                                data.callId,

                            fromUserId:
                                userId,

                            signal:
                                data.signal

                        }
                    );

                }
            );


            /* ==================================================
               DISCONNECT
            ================================================== */

            socket.on(
                "disconnect",
                () => {

                    if (
                        onlineUsers.get(userId) ===
                        socket.id
                    ) {

                        onlineUsers.delete(
                            userId
                        );

                    }


                    console.log(
                        "Calling socket disconnected:",
                        user.fullName
                    );

                }
            );

        }

        catch (error) {

            console.error(
                "Socket authentication error:",
                error.message
            );

            socket.emit(
                "call:error",
                {
                    message:
                        "Calling authentication failed."
                }
            );

            socket.disconnect(true);

        }

    });

}


/* ==========================================================
   FIND SOCKET
========================================================== */

function findSocketByCallParticipant(userId) {

    if (!userId)
        return null;

    return onlineUsers.get(
        String(userId)
    ) || null;

}


/* ==========================================================
   EXPORT
========================================================== */

module.exports =
    initializeCalling;