export type ToneType = keyof typeof tones;

export const tones = {
    professional: {
        name: "Professional",
        prompt: "Refine the following message into a clear, confident, and professional tone. Keep it polished and under 300 characters."
    },
    formal: {
        name: "Formal",
        prompt: "You're an expert copywriter. Rewrite the message below to sound formal and professional. Keep it under 300 characters."
    },
    playful: {
        name: "Playful",
        prompt: "Rewrite the message with a playful and cheeky tone. Make it fun and attention-grabbing, suitable for SMS or social media. Keep it under 300 characters."
    },
    urgent: {
        name: "Urgent",
        prompt: "You're an expert copywriter. Rewrite the message below to sound urgent and persuasive. Create FOMO while keeping it under 300 characters."
    },
    casual: {
        name: "Casual",
        prompt: "Rewrite the message in a friendly, casual tone like you’re talking to a friend. Make it short, clear, and engaging. Limit to 300 characters."
    },
    witty: {
        name: "Witty",
        prompt: "Make the message sharp, witty, and clever without being cringey. Keep it under 300 characters and suitable for performance marketing."
    },
    friendly: {
        name: "Friendly",
        prompt: "Rewrite the message in a friendly, warm tone like you’re talking to a friend. Make it short, clear, and engaging. Limit to 300 characters."
    },
    empathetic: {
        name: "Empathetic",
        prompt: "Rewrite the message with a caring, human-centered tone. Show empathy while still encouraging action. Limit to 300 characters."
    },
    bold: {
        name: "Bold",
        prompt: "Rewrite the message with a bold, assertive tone. Be confident, punchy, and direct — make the user feel like they'd miss out if they ignore it. Max 300 characters."
    }
};
