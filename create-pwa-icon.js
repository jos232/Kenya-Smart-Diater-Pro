const sharp = require("sharp");

sharp("assets/logo.png")
    .resize(512, 512, {
        fit: "contain",
        background: {
            r: 15,
            g: 23,
            b: 42,
            alpha: 1
        }
    })
    .png()
    .toFile("assets/pwa-icon-512.png")
    .then(() => {
        console.log("✅ PWA icon created: assets/pwa-icon-512.png");
    })
    .catch((error) => {
        console.error("❌ Error creating PWA icon:", error);
    });