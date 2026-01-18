const COINS_KEY = "love_confession_coins";
const COINS_HISTORY_KEY = "love_confession_coins_history";

// Get current coins balance
export function getCoins() {
  try {
    const coins = localStorage.getItem(COINS_KEY);
    return coins ? parseInt(coins, 10) : 0;
  } catch (error) {
    console.error("Error reading coins:", error);
    return 0;
  }
}

// Add coins (after purchase)
export function addCoins(amount) {
  try {
    const current = getCoins();
    const newBalance = current + amount;
    localStorage.setItem(COINS_KEY, newBalance.toString());
    
    // Add to history
    addCoinsHistory({
      type: "purchase",
      amount,
      balance: newBalance,
      timestamp: new Date().toISOString(),
    });
    
    window.dispatchEvent(new Event("coinsUpdated"));
    return newBalance;
  } catch (error) {
    console.error("Error adding coins:", error);
    return getCoins();
  }
}

// Spend coins
export function spendCoins(amount, reason = "purchase") {
  try {
    const current = getCoins();
    if (current < amount) {
      return false; // Insufficient coins
    }
    const newBalance = current - amount;
    localStorage.setItem(COINS_KEY, newBalance.toString());
    
    // Add to history
    addCoinsHistory({
      type: "spend",
      amount: -amount,
      reason,
      balance: newBalance,
      timestamp: new Date().toISOString(),
    });
    
    window.dispatchEvent(new Event("coinsUpdated"));
    return true;
  } catch (error) {
    console.error("Error spending coins:", error);
    return false;
  }
}

// Check if user has enough coins
export function hasEnoughCoins(amount) {
  return getCoins() >= amount;
}

// Get coins history
export function getCoinsHistory() {
  try {
    const history = localStorage.getItem(COINS_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error reading coins history:", error);
    return [];
  }
}

// Add to coins history
function addCoinsHistory(entry) {
  try {
    const history = getCoinsHistory();
    history.unshift(entry);
    // Keep only last 50 entries
    if (history.length > 50) {
      history.splice(50);
    }
    localStorage.setItem(COINS_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error saving coins history:", error);
  }
}

// Gift prices
export const GIFT_PRICES = {
  rose: 10,
  ring: 50,
  loveLetter: 30,
  chocolate: 20,
  heart: 15,
  star: 25,
};

// Coin packages for purchase
export const COIN_PACKAGES = [
  { id: "small", coins: 100, price: 1, label: "100 Coins", popular: false },
  { id: "medium", coins: 300, price: 2.5, label: "300 Coins", popular: true },
  { id: "large", coins: 600, price: 4, label: "600 Coins", popular: false },
  { id: "mega", coins: 1500, price: 9, label: "1500 Coins", popular: false },
];
