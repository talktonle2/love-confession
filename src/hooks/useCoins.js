import { useState, useEffect } from "react";
import { getCoins, addCoins, spendCoins, hasEnoughCoins } from "../utils/coins.js";

export function useCoins() {
  const [coins, setCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const checkCoins = () => {
    try {
      const balance = getCoins();
      setCoins(balance);
    } catch (error) {
      console.error("Error checking coins:", error);
      setCoins(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkCoins();
    window.addEventListener("coinsUpdated", checkCoins);
    return () => window.removeEventListener("coinsUpdated", checkCoins);
  }, []);

  const purchaseCoins = (amount) => {
    const newBalance = addCoins(amount);
    setCoins(newBalance);
    return newBalance;
  };

  const useCoins = (amount, reason) => {
    const success = spendCoins(amount, reason);
    if (success) {
      setCoins(getCoins());
    }
    return success;
  };

  const canAfford = (amount) => {
    return hasEnoughCoins(amount);
  };

  return {
    coins,
    isLoading,
    purchaseCoins,
    useCoins,
    canAfford,
    refresh: checkCoins,
  };
}
