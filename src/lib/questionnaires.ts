
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
        id: 'waterIntake',
        question: 'How much water do you typically drink per day?',
        options: ['Less than 2 glasses', '2-4 glasses', '5-7 glasses', '8 or more glasses'],
      },
      {
        id: 'snackingHabits',
        question: 'How would you describe your snacking habits?',
        options: ['I don\'t usually snack', 'I snack on fruits and nuts', 'I crave salty snacks (chips, pretzels)', 'I crave sugary snacks (candy, pastries)'],
      },
      {
        id: 'cookingFrequency',
        question: 'How often do you cook meals at home?',
        options: ['Almost every meal', 'A few times a week', 'Rarely', 'Never'],
      },
      {
        id: 'shortTermGoal',
        question: "What's a short-term nutrition goal you have for the next month?",
        options: ['Improve my energy levels', 'Cut down on sugary snacks', 'Incorporate more vegetables', 'Learn a few healthy recipes'],
      },
      {
        id: 'longTermGoal',
        question: 'Looking ahead 6 months, what long-term health outcome are you hoping for?',
        options: ['Sustainable weight loss/management', 'Feeling confident in my food choices', 'Running a 5k or other fitness event', 'Better management of a chronic condition'],
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
        question: 'How connected have you felt to others lately?',
        options: ['Very connected and supported', 'Somewhat connected', 'A little isolated', 'Very lonely and disconnected'],
      },
      {
        id: 'enjoyment',
        question: 'Have you been finding joy or interest in your usual activities?',
        options: ['Yes, as much as usual', 'A little less than usual', 'Much less than usual', 'I\'ve lost interest completely'],
      },
      {
        id: 'shortTermGoal',
        question: "What is one thing you'd like to work on for your emotional well-being in the next month?",
        options: ['Developing a self-care routine', 'Better understanding my emotional triggers', 'Improving communication in a relationship', 'Reducing feelings of anxiety in specific situations'],
      },
      {
        id: 'longTermGoal',
        question: 'What does long-term emotional well-being look like for you?',
        options: ['Feeling more at peace with myself', 'Having healthier, more stable relationships', 'Feeling more resilient to life\'s stressors', 'A deeper sense of purpose and fulfillment'],
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
        id: 'perfectionism',
        question: 'Do you often feel that what you do is never good enough?',
        options: ['No, I\'m usually happy with "good enough"', 'Sometimes I struggle with this', 'Yes, I often feel like a perfectionist', 'Yes, it causes me significant stress'],
      },
      {
        id: 'reactionToMistakes',
        question: 'When you make a mistake, what is your typical inner response?',
        options: ['"I can learn from this."', '"I\'m so stupid."', '"I always mess things up."', '"I should have known better."'],
      },
       {
        id: 'physicalAnxiety',
        question: 'When you feel anxious, do you notice physical symptoms (e.g., racing heart, tight chest)?',
        options: ['Never', 'Sometimes', 'Often', 'Almost always'],
      },
      {
        id: 'shortTermGoal',
        question: "What's a specific behavioral pattern you'd like to address in the short term?",
        options: ['Challenging negative self-talk', 'Breaking a procrastination cycle on a specific task', 'Facing a small, avoided situation', 'Practicing mindfulness for 5 minutes daily'],
      },
      {
        id: 'longTermGoal',
        question: 'What long-term cognitive or behavioral change are you aiming for?',
        options: ['Developing a more balanced perspective', 'Responding to challenges with more flexibility', 'Reducing avoidance behaviors significantly', 'Building stronger self-esteem'],
      },
    ],
  },
  {
    agentId: 'trauma-therapist',
    title: 'Developmental History Profile',
    description: 'This questionnaire is designed to help your AI advisor understand your early life experiences and relationships. Please answer in a way that feels safe and comfortable for you.',
    questions: [
      {
        id: 'childhoodFeeling',
        question: 'Thinking back to your childhood, which word best describes how you generally felt?',
        options: ['Secure and loved', 'Often anxious or on-edge', 'Independent and self-reliant', 'Confused or unheard'],
      },
      {
        id: 'caregiverComfort',
        question: 'When you were upset as a child, was there a caregiver you could consistently turn to for comfort?',
        options: ['Yes, always', 'Sometimes, but it was unpredictable', 'Rarely, I usually had to soothe myself', 'No, I learned not to show I was upset'],
      },
      {
        id: 'currentRelationships',
        question: 'In your adult relationships (friendships or romantic), how easy is it for you to trust others?',
        options: ['Very easy, I trust openly', 'It takes me a little while', 'It\'s very difficult for me', 'I expect to be let down'],
      },
      {
        id: 'selfCriticism',
        question: 'How would you describe your inner critic?',
        options: ['Gentle and encouraging', 'Mostly quiet', 'Often harsh and loud', 'Relentless'],
      },
      {
        id: 'familySecrets',
        question: 'Were there "unspoken rules" or topics that were not to be discussed in your family?',
        options: ['No, our communication was very open', 'Yes, a few things were off-limits', 'Yes, many topics were avoided', 'I\'m not sure'],
      },
      {
        id: 'shortTermGoal',
        question: 'What is a short-term goal you have for feeling safer or more connected in your life?',
        options: ['Identifying one safe person to talk to', 'Practicing one grounding technique daily', 'Journaling about feelings without judgment', 'Setting a small boundary in a relationship'],
      },
      {
        id: 'longTermGoal',
        question: 'What does long-term healing or connection look like for you?',
        options: ['Feeling more at home in my own body', 'Building trusting and secure relationships', 'Being able to process difficult emotions safely', 'Understanding my past without being defined by it'],
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
            id: 'preferredWorkout',
            question: 'What type of exercise do you enjoy the most?',
            options: ['Cardio (running, cycling)', 'Strength training (weights)', 'Mind-body (yoga, pilates)', 'Team sports', 'I\'m not sure yet'],
        },
        {
            id: 'biggestObstacle',
            question: 'What is your biggest obstacle to exercising regularly?',
            options: ['Lack of time', 'Lack of motivation', 'Not knowing what to do', 'It feels boring or tedious', 'Physical limitations'],
        },
        {
            id: 'workoutDuration',
            question: 'How much time can you realistically dedicate to a workout session?',
            options: ['15-20 minutes', '30-45 minutes', '60 minutes', 'More than 60 minutes'],
        },
        {
          id: 'accountability',
          question: 'What best helps you stay accountable to your fitness goals?',
          options: ['Tracking my progress', 'Having a workout buddy', 'Setting rewards for myself', 'Following a structured plan', 'I struggle with accountability'],
        },
        {
            id: 'shortTermGoal',
            question: 'What is a fitness goal you have for the next 2-4 weeks?',
            options: ['Establishing a consistent workout routine', 'Completing a 20-minute workout without stopping', 'Improving my flexibility in one area', 'Increasing the weight I can lift'],
        },
        {
            id: 'longTermGoal',
            question: 'What is your ultimate long-term fitness ambition?',
            options: ['Running a 10k or half-marathon', 'Feeling strong and capable in daily activities', 'Making fitness a permanent and enjoyable part of my life', 'Achieving a specific body composition goal'],
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
            id: 'procrastinationTrigger',
            question: 'When you procrastinate, what is the most common reason?',
            options: ['The task feels too big or overwhelming', 'I\'m not sure where to start', 'I get distracted by other things', 'I\'m waiting for the "perfect" time', 'I don\'t feel like it'],
        },
        {
            id: 'energyLevels',
            question: 'When do you feel most productive and energetic?',
            options: ['Early morning', 'Late morning', 'Afternoon', 'Evening', 'My energy is inconsistent'],
        },
        {
            id: 'digitalClutter',
            question: 'How would you describe your digital life (email inbox, computer desktop)?',
            options: ['Very organized', 'Somewhat organized', 'A bit chaotic', 'Completely overwhelming'],
        },
        {
            id: 'shortTermGoal',
            question: 'What is a short-term organizational goal you want to achieve this month?',
            options: ['Develop a morning routine and stick to it for a week', 'Clear out and organize one cluttered area (e.g., a desk)', 'Plan my meals for one week', 'Reach "inbox zero" on my email'],
        },
        {
            id: 'longTermGoal',
            question: 'What does being "organized" look like for you in the long run?',
            options: ['Feeling less stressed and more in control of my time', 'Having systems that make daily life easier', 'Spending less time on chores and more on what I enjoy', 'Consistently meeting my personal and professional deadlines'],
        },
    ]
  }
];
