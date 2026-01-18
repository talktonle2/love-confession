// Smart Match Algorithm - Calculate compatibility score
export function calculateCompatibility(profile1, profile2) {
  let score = 0;
  let factors = [];

  // Interest matching (40% weight)
  if (profile1.interests && profile2.interests) {
    const commonInterests = profile1.interests.filter(i => 
      profile2.interests.includes(i)
    );
    const interestScore = (commonInterests.length / Math.max(profile1.interests.length, profile2.interests.length)) * 40;
    score += interestScore;
    factors.push({
      name: "Interests",
      score: interestScore,
      details: `${commonInterests.length} common interests`
    });
  }

  // Age compatibility (20% weight)
  const ageDiff = Math.abs(profile1.age - profile2.age);
  const ageScore = ageDiff <= 5 ? 20 : ageDiff <= 10 ? 15 : ageDiff <= 15 ? 10 : 5;
  score += ageScore;
  factors.push({
    name: "Age",
    score: ageScore,
    details: `${ageDiff} years difference`
  });

  // Activity level (20% weight)
  if (profile1.activityLevel && profile2.activityLevel) {
    const activityMatch = Math.abs(profile1.activityLevel - profile2.activityLevel);
    const activityScore = activityMatch <= 1 ? 20 : activityMatch <= 2 ? 15 : 10;
    score += activityScore;
    factors.push({
      name: "Activity",
      score: activityScore,
      details: "Similar activity level"
    });
  }

  // Bio similarity (20% weight) - simple keyword matching
  if (profile1.bio && profile2.bio) {
    const bio1Words = profile1.bio.toLowerCase().split(/\s+/);
    const bio2Words = profile2.bio.toLowerCase().split(/\s+/);
    const commonWords = bio1Words.filter(w => bio2Words.includes(w) && w.length > 3);
    const bioScore = Math.min((commonWords.length / 5) * 20, 20);
    score += bioScore;
    factors.push({
      name: "Bio",
      score: bioScore,
      details: "Similar interests mentioned"
    });
  }

  // Round to nearest integer
  score = Math.round(score);

  // Determine compatibility level
  let level = "low";
  let emoji = "💙";
  if (score >= 80) {
    level = "excellent";
    emoji = "💖";
  } else if (score >= 65) {
    level = "high";
    emoji = "💕";
  } else if (score >= 50) {
    level = "good";
    emoji = "💗";
  } else if (score >= 40) {
    level = "fair";
    emoji = "💙";
  }

  return {
    score,
    level,
    emoji,
    factors
  };
}

// Mock user profile data structure
export function createUserProfile(user) {
  return {
    id: user.id,
    name: user.name,
    age: user.age,
    bio: user.bio,
    interests: user.interests || ["travel", "music", "food"],
    activityLevel: user.activityLevel || Math.floor(Math.random() * 5) + 1, // 1-5
    onlineStatus: user.isOnline || false,
  };
}
