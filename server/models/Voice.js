/* ==========================================
   BUY VOICE PACKAGE
========================================== */

async function buyVoicePackage() {

    /* -------------------------
       CHECK PACKAGE
    ------------------------- */

    if (!selectedVoicePackage) {

        alert("Please select a voice package.");

        return;

    }

    /* -------------------------
       GET PHONE NUMBER
    ------------------------- */

    const phoneInput = document.getElementById("voiceNumber");

    if (!phoneInput) {

        showToast("Voice number field not found.", "error");

        return;

    }

    const phone = normalizeNumber(phoneInput.value.trim());

    if (!isValidKenyanNumber(phone)) {

        alert("Please enter a valid Kenyan phone number.");

        return;

    }

    /* -------------------------
       DETECT NETWORK
    ------------------------- */

    const network = detectNetwork(phone);

    try {

        /* -------------------------
           SAVE TO BACKEND
        ------------------------- */

        const result = await apiPost("/voice", {

            phone: phone,

            network: network,

            packageName: selectedVoicePackage.name,

            minutes: selectedVoicePackage.minutes,

            price: selectedVoicePackage.price,

            paymentMethod: "Wallet"

        });

        if (!result.success) {

            alert(result.message || "Voice purchase failed.");

            return;

        }

        /* -------------------------
           UPDATE LOCAL TELECOM
        ------------------------- */

        Telecom.voice =
            (Telecom.voice || 0) +
            selectedVoicePackage.minutes;

        Telecom.save();

        /* -------------------------
           SAVE HISTORY
        ------------------------- */

        saveVoicePurchase(selectedVoicePackage);

        /* -------------------------
           REFRESH DASHBOARD
        ------------------------- */

        if (typeof refreshDashboardCards === "function") {

            await refreshDashboardCards();

        }

        if (typeof updateTelecomDashboard === "function") {

            updateTelecomDashboard();

        }

        /* -------------------------
           REFRESH HISTORY
        ------------------------- */

        renderVoiceHistory();

        /* -------------------------
           RESET FORM
        ------------------------- */

        phoneInput.value = "";

        selectedVoicePackage = null;

        document.getElementById("voiceSummaryPackage").textContent = "--";

        document.getElementById("voiceSummaryMinutes").textContent = "--";

        document.getElementById("voiceSummaryPrice").textContent = "--";

        /* -------------------------
           SUCCESS
        ------------------------- */

        showToast("🎤 Voice package activated successfully.");

    }

    catch (error) {

        console.error("Voice Purchase:", error);

        showToast(

            error.message || "Unable to activate voice package.",

            "error"

        );

    }

}