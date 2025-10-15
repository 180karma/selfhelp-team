export type Question = {
  id: string;
  question: string;
  options: string[];
};

export type Questionnaire = {
  agentId: string;
  title: string;
  description: string;
  questions: Question[];
};

export const questionnaires: Questionnaire[] = [
  {
    agentId: 'nutritionist',
    title: 'Nutrition & Wellness Profile',
    description: "Help us understand your nutritional habits and goals. Your answers will help your AI Nutritionist tailor their advice to you.",
    questions: [
      {
        id: 'primaryGoal',
        question: 'What is your primary health goal?',
        options: ['Lose weight', 'Gain muscle', 'Eat healthier', 'Manage a health condition', 'Improve energy levels'],
      },
      {
        id: 'typicalBreakfast',
        question: 'What does a typical breakfast look like for you?',
        options: ['Nothing', 'Coffee/Tea only', 'Cereal or toast', 'Eggs or protein-rich meal', 'Smoothie or yogurt'],
      },
      {
        id: 'cookingFrequency',
        question: 'How often do you cook meals at home?',
        options: ['Almost every meal', 'A few times a week', 'Rarely', 'Never'],
      },
      {
        id: 'snackHabits',
        question: 'What do you typically reach for when you snack?',
        options: ['Fruits or vegetables', 'Chips or crackers', 'Sweets (candy, cookies)', 'Nuts or seeds', 'I don\'t usually snack'],
      },
      {
        id: 'dietaryRestrictions',
        question: 'Do you have any dietary restrictions?',
        options: ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'],
      },
    ],
  },
  {
    agentId: 'psychologist',
    title: 'Mental & Emotional Wellness Profile',
    description: "This confidential questionnaire helps your AI Psychology Advisor understand what's on your mind. Please answer openly.",
    questions: [
      {
        id: 'currentMood',
        question: 'How would you describe your overall mood this past week?',
        options: ['Mostly happy and positive', 'A mix of ups and downs', 'Mostly down or irritable', 'Feeling numb or empty'],
      },
      {
        id: 'stressLevel',
        question: 'On a scale of 1 to 5, how would you rate your current stress level? (5 being highest)',
        options: ['1 - Very Low', '2 - Low', '3 - Moderate', '4 - High', '5 - Very High'],
      },
      {
        id: 'sleepQuality',
        question: 'How has your sleep quality been recently?',
        options: ['Excellent, I feel rested', 'Good, mostly restful', 'Fair, sometimes restless', 'Poor, I wake up tired'],
      },
      {
        id: 'socialConnection',
        question: 'How connected do you feel to others (friends, family)?',
        options: ['Very connected', 'Somewhat connected', 'Slightly disconnected', 'Very isolated'],
      },
      {
        id: 'copingMechanisms',
        question: 'When you feel overwhelmed, what is your go-to coping strategy?',
        options: ['Exercise or physical activity', 'Talking to someone', 'Hobbies or creative outlets', 'Resting or taking a break', 'I struggle to cope'],
      },
    ],
  },
  {
    agentId: 'cbt-therapist',
    title: 'Cognitive & Behavioral Patterns',
    description: "This questionnaire helps your AI CBT Practitioner identify patterns to work on. Your responses are a starting point for self-discovery.",
    questions: [
      {
        id: 'negativeThoughts',
        question: 'How often do you find yourself stuck in cycles of negative thinking?',
        options: ['Rarely or never', 'Sometimes', 'Often', 'Almost constantly'],
      },
      {
        id: 'avoidanceBehavior',
        question: 'Are there situations, people, or places you actively avoid out of fear or anxiety?',
        options: ['No, not really', 'Yes, one or two things', 'Yes, several things affect my daily life', 'Yes, my world feels very small'],
      },
      {
        id: 'reactionToMistakes',
        question: 'When you make a mistake, what is your typical inner response?',
        options: ['"I can learn from this."', '"I\'m so stupid."', '"I always mess things up."', '"I should have known better."'],
      },
      {
        id: 'procrastination',
        question: 'How much does procrastination affect your daily life?',
        options: ['Not at all', 'A little bit', 'It\'s a significant problem', 'It\'s debilitating'],
      },
      {
        id: 'selfCriticism',
        question: 'How would you describe your inner critic?',
        options: ['Quiet and manageable', 'Pops up sometimes', 'Loud and frequent', 'Constant and harsh'],
      },
    ],
  },
  {
    agentId: 'fitness-instructor',
    title: 'Fitness & Activity Profile',
    description: "Let's get moving! Your AI Fitness Coach needs to know your starting point to cheer you on effectively.",
    questions: [
        {
            id: 'currentActivityLevel',
            question: 'What is your current activity level?',
            options: ['Sedentary (little to no exercise)', 'Lightly active (walking, light exercise 1-2 days/week)', 'Moderately active (exercise 3-5 days/week)', 'Very active (intense exercise 6-7 days/week)'],
        },
        {
            id: 'fitnessGoals',
            question: 'What are your main fitness goals?',
            options: ['Improve cardiovascular health', 'Build strength', 'Increase flexibility', 'Lose weight', 'Prepare for an event (e.g., a race)'],
        },
        {
            id: 'preferredWorkout',
            question: 'What type of exercise do you enjoy the most?',
            options: ['Cardio (running, cycling)', 'Strength training (weights)', 'Mind-body (yoga, pilates)', 'Team sports', 'I\'m not sure yet'],
        },
        {
            id: 'workoutDuration',
            question: 'How much time can you realistically dedicate to a workout session?',
            options: ['15-20 minutes', '30-45 minutes', '60 minutes', 'More than 60 minutes'],
        },
        {
            id: 'biggestChallenge',
            question: 'What\'s your biggest challenge when it comes to fitness?',
            options: ['Lack of motivation', 'Lack of time', 'Not knowing what to do', 'Getting bored easily', 'Physical limitations or injuries'],
        },
    ]
  },
  {
    agentId: 'personal-life-manager',
    title: 'Life & Organization Profile',
    description: "Help your AI Life Manager understand your routines and challenges to help you get organized.",
    questions: [
        {
            id: 'mainChallenge',
            question: 'What is the biggest organizational challenge in your life right now?',
            options: ['Managing my time effectively', 'Keeping my physical space tidy', 'Balancing work and personal life', 'Sticking to a routine', 'Managing tasks and to-do lists'],
        },
        {
            id: 'planningStyle',
            question: 'How do you typically plan your week?',
            options: ['I have a detailed schedule', 'I have a general to-do list', 'I go with the flow', 'I plan day-by-day', 'I don\'t plan'],
        },
        {
            id: 'energyLevels',
            question: 'When do you feel most productive and energetic?',
            options: ['Early morning', 'Late morning', 'Afternoon', 'Evening', 'My energy is inconsistent'],
        },
        {
            id: 'digitalClutter',
            question: 'How do you feel about your digital life (emails, files, photos)?',
            options: ['Very organized', 'Somewhat organized', 'A bit messy', 'Very cluttered and overwhelming'],
        },
        {
            id: 'goalSetting',
            question: 'How do you approach personal goals?',
            options: ['I set clear, written goals', 'I have goals in my head', 'I find it hard to set or stick to goals', 'I focus more on daily tasks than long-term goals'],
        },
    ]
  }
];
