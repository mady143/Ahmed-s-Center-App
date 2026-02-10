/**
 * Generates an order number in the format: MMDDYYYY + 5 random digits.
 * @returns {string} The generated order number.
 */
export const generateOrderNo = () => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const yyyy = now.getFullYear();

    // Generate 5 random digits
    const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();

    return `${dd}${mm}${yyyy}${randomDigits}`;
};
