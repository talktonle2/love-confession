const STORAGE_KEY = "love_confessions";

// Get all confessions from localStorage
export function getConfessions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }
  return [];
}

// Save a confession to localStorage
export function saveConfession(confession) {
  try {
    const confessions = getConfessions();
    confessions.push(confession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(confessions));
    // Dispatch custom event to update other components
    window.dispatchEvent(new Event("confessionsUpdated"));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
}

// Get a single confession by ID
export function getConfessionById(id) {
  const confessions = getConfessions();
  return confessions.find((c) => c.id === id);
}

// Delete a confession by ID
export function deleteConfession(id) {
  try {
    const confessions = getConfessions();
    const filtered = confessions.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    // Dispatch custom event to update other components
    window.dispatchEvent(new Event("confessionsUpdated"));
    return true;
  } catch (error) {
    console.error("Error deleting from localStorage:", error);
    return false;
  }
}

// Update a confession
export function updateConfession(id, updates) {
  try {
    const confessions = getConfessions();
    const index = confessions.findIndex((c) => c.id === id);
    if (index !== -1) {
      confessions[index] = { ...confessions[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(confessions));
      // Dispatch custom event to update other components
      window.dispatchEvent(new Event("confessionsUpdated"));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating localStorage:", error);
    return false;
  }
}

// Increment view count for a confession
export function incrementViews(id) {
  try {
    const confessions = getConfessions();
    const index = confessions.findIndex((c) => c.id === id);
    if (index !== -1) {
      confessions[index].views = (confessions[index].views || 0) + 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(confessions));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error incrementing views:", error);
    return false;
  }
}

// Increment share count for a confession
export function incrementShares(id) {
  try {
    const confessions = getConfessions();
    const index = confessions.findIndex((c) => c.id === id);
    if (index !== -1) {
      confessions[index].shares = (confessions[index].shares || 0) + 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(confessions));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error incrementing shares:", error);
    return false;
  }
}

// Get favorite confessions
export function getFavorites() {
  try {
    const favorites = localStorage.getItem("love_confessions_favorites");
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error reading favorites:", error);
    return [];
  }
}

// Toggle favorite status
export function toggleFavorite(id) {
  try {
    const favorites = getFavorites();
    const index = favorites.indexOf(id);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(id);
    }
    localStorage.setItem("love_confessions_favorites", JSON.stringify(favorites));
    return index === -1; // Returns true if added, false if removed
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return false;
  }
}

// Check if confession is favorited
export function isFavorite(id) {
  const favorites = getFavorites();
  return favorites.includes(id);
}

// Initialize with mock data if empty
export function initializeStorage() {
  const confessions = getConfessions();
  if (confessions.length === 0) {
    const mockData = [
      {
        id: "abc123",
        to: "Crush",
        from: "Anonymous",
        category: "Crush",
        message: "ខ្ញុំចូលចិត្តអ្នកយូរហើយ… តែខ្ញុំមិនហ៊ាននិយាយទេ ❤️",
        createdAt: new Date().toISOString().split("T")[0],
        likes: 24,
        reactions: { heart: 10, wow: 4, laugh: 2, cry: 1, fire: 7 },
      },
      {
        id: "khr001",
        to: "Someone Special",
        from: "S",
        category: "Secret",
        message: "អ្នកគឺជាហេតុផលដែលធ្វើឲ្យថ្ងៃខ្ញុំកាន់តែស្អាត 🙂",
        createdAt: new Date().toISOString().split("T")[0],
        likes: 12,
        reactions: { heart: 6, wow: 2, laugh: 1, cry: 0, fire: 3 },
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  }
}
