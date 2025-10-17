
export const acknowledgements: string[] = [
    "I understand.",
    "That makes sense.",
    "Thank you for clarifying.",
    "I see.",
    "Okay, I've got that.",
    "Got it.",
    "That's helpful, thank you.",
    "I appreciate you sharing that.",
    "That gives me a clearer picture.",
    "Right, okay.",
    "Understood.",
    "That's a good point.",
    "I hear you.",
    "Okay, thanks for explaining.",
    "That helps me understand better.",
];

/**
 * Gets a random acknowledgement from the list, but avoids returning the same one twice in a row.
 * @param lastAcknowledgement The last acknowledgement that was used.
 * @returns A random acknowledgement string.
 */
export function getRandomAcknowledgement(lastAcknowledgement?: string): string {
    let filteredAcknowledgements = acknowledgements;
    if (lastAcknowledgement) {
        filteredAcknowledgements = acknowledgements.filter(ack => ack !== lastAcknowledgement);
    }
    
    if (filteredAcknowledgements.length === 0) {
        // This fallback runs if there's only one acknowledgement or if lastAcknowledgement isn't in the list
        return acknowledgements[0] || ""; 
    }

    const randomIndex = Math.floor(Math.random() * filteredAcknowledgements.length);
    return filteredAcknowledgements[randomIndex];
}
