
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
      {
        id: 'dietaryRestrictions',
        question: 'Do you have any dietary restrictions or preferences?',
        options: ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'],
      },
      {
        id: 'fruitVegIntake',
        question: 'How many servings of fruits and vegetables do you eat on an average day?',
        options: ['0-1 servings', '2-3 servings', '4-5 servings', 'More than 5 servings'],
      },
      {
        id: 'eatingOutFrequency',
        question: 'How often do you eat meals from restaurants (including takeout)?',
        options: ['Rarely or never', '1-2 times a week', '3-5 times a week', 'More than 5 times a week'],
      },
      {
        id: 'alcoholConsumption',
        question: 'How would you describe your alcohol consumption?',
        options: ['I don\'t drink alcohol', 'Occasionally (socially)', 'A few times a week', 'Daily'],
      },
      {
        id: 'supplements',
        question: 'Do you currently take any vitamins or supplements?',
        options: ['No', 'A multivitamin', 'Specific supplements (e.g., Vitamin D, Iron)', 'Protein powder or sports supplements'],
      },
      {
        id: 'foodLabels',
        question: 'How often do you read nutrition labels when shopping?',
        options: ['Always', 'Sometimes', 'Rarely', 'Never'],
      },
      {
        id: 'mealTiming',
        question: 'When do you typically eat your largest meal of the day?',
        options: ['Morning (Breakfast)', 'Midday (Lunch)', 'Evening (Dinner)', 'My meals are all about the same size'],
      },
      {
        id: 'emotionalEating',
        question: 'Do you notice a connection between your mood and your eating habits?',
        options: ['Yes, I eat more when stressed or sad', 'Yes, I eat less when stressed or sad', 'No, my eating is not affected by my mood', 'I\'m not sure'],
      },
      {
        id: 'pastDiets',
        question: 'What is your experience with dieting?',
        options: ['I have never been on a formal diet', 'I have tried a few diets with some success', 'I have tried many diets without long-term success', 'I am currently on a diet'],
      },
      {
        id: 'energyLevels',
        question: 'How are your energy levels throughout the day?',
        options: ['Stable and consistent', 'I have a big crash in the afternoon', 'I feel tired most of the day', 'My energy is unpredictable'],
      }
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
      {
        id: 'copingMechanisms',
        question: 'When you feel overwhelmed, what is your go-to coping mechanism?',
        options: ['Talk to a friend or family member', 'Distract myself (TV, social media)', 'Exercise or go for a walk', 'Withdraw and be alone', 'Use substances (food, alcohol, etc.)'],
      },
      {
        id: 'selfTalk',
        question: 'What is the general tone of your inner voice or self-talk?',
        options: ['Supportive and kind', 'Neutral and objective', 'Often critical and harsh', 'I don\'t really notice my self-talk'],
      },
      {
        id: 'therapyHistory',
        question: 'Have you ever been in therapy or counseling before?',
        options: ['Yes, and it was a positive experience', 'Yes, and it was a negative or neutral experience', 'No, this is my first time exploring it', 'I have considered it but never gone'],
      },
      {
        id: 'emotionalAwareness',
        question: 'How easily can you identify the specific emotions you are feeling?',
        options: ['Very easily, I know what I\'m feeling', 'Sometimes, but it can be confusing', 'It\'s often difficult to name my feelings', 'I mostly just feel "good" or "bad"'],
      },
      {
        id: 'relationshipPatterns',
        question: 'Do you notice any recurring patterns in your close relationships?',
        options: ['Yes, mostly healthy patterns', 'Yes, some patterns I\'d like to change', 'No, my relationships are all very different', 'I\'m not sure what to look for'],
      },
      {
        id: 'lifeSatisfaction',
        question: 'Overall, how satisfied are you with your life right now?',
        options: ['Very satisfied', 'Somewhat satisfied', 'Neutral', 'Somewhat dissatisfied', 'Very dissatisfied'],
      },
      {
        id: 'pastTrauma',
        question: 'Have you experienced a significant life event that still impacts you today?',
        options: ['Yes, and I have worked through it', 'Yes, and it still affects me', 'No, not that I can think of', 'I prefer not to answer'],
      },
      {
        id: 'selfCare',
        question: 'What does self-care typically look like for you?',
        options: ['I have a regular self-care routine', 'I do it when I feel I need it', 'I often feel too busy for self-care', 'I\'m not sure what self-care means for me'],
      },
      {
        id: 'coreValues',
        question: 'How clear are you on your personal core values?',
        options: ['Very clear, they guide my decisions', 'I have a general idea', 'I haven\'t really thought about it', 'My values feel conflicted'],
      },
      {
        id: 'motivationForChange',
        question: 'What is your primary motivation for seeking support at this time?',
        options: ['A specific crisis or event', 'A general feeling of being "stuck"', 'A desire for personal growth', 'External pressure from others'],
      }
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
      {
        id: 'procrastination',
        question: 'When you have an important task, what are you most likely to do?',
        options: ['Start on it right away', 'Plan it out, then start', 'Wait until the last minute', 'Avoid it for as long as possible'],
      },
      {
        id: 'catastrophizing',
        question: 'Do you often jump to the worst-case scenario?',
        options: ['Rarely, I\'m pretty realistic', 'Sometimes, when I\'m stressed', 'Often, it\'s my default way of thinking', 'I am always prepared for the worst'],
      },
      {
        id: 'blackAndWhiteThinking',
        question: 'Do you tend to see things in all-or-nothing terms (e.g., success/failure, good/bad)?',
        options: ['No, I usually see shades of gray', 'Sometimes, especially when it comes to my performance', 'Yes, this is a common pattern for me', 'I believe things are either right or wrong'],
      },
      {
        id: 'selfCompassion',
        question: 'How do you treat yourself when you are having a difficult time?',
        options: ['With kindness and understanding', 'I try to be kind, but it\'s hard', 'I tend to ignore my feelings and push through', 'I am very hard on myself'],
      },
      {
        id: 'rumination',
        question: 'Do you find yourself replaying past conversations or events over and over in your mind?',
        options: ['Rarely or never', 'Sometimes, if something is bothering me', 'Yes, I get stuck on things for a long time', 'It feels like my mind is a broken record'],
      },
      {
        id: 'safetyBehaviors',
        question: 'In social situations, do you do things to avoid judgment (e.g., rehearse what you\'ll say, avoid eye contact)?',
        options: ['No, I feel comfortable being myself', 'Sometimes, in new situations', 'Yes, I rely on these behaviors to get through', 'I avoid social situations altogether'],
      },
      {
        id: 'assertiveness',
        question: 'How easy is it for you to express your needs or disagree with others?',
        options: ['Very easy', 'Challenging, but I can do it', 'Very difficult, I tend to go along with others', 'I avoid conflict at all costs'],
      },
      {
        id: 'coreBeliefSelf',
        question: 'Which statement resonates most with you?',
        options: ['"I am fundamentally capable."', '"I am fundamentally flawed."', '"I am fundamentally uninteresting."', '"I must always be in control."'],
      },
      {
        id: 'thoughtRecordFamiliarity',
        question: 'Have you ever heard of or used a "thought record"?',
        options: ['Yes, I use them regularly', 'Yes, I have tried it before', 'I\'ve heard of it, but never tried it', 'No, I have no idea what that is'],
      },
      {
        id: 'problemSolvingStyle',
        question: 'When faced with a problem, what is your first instinct?',
        options: ['Break it down into smaller steps', 'Worry about it and feel overwhelmed', 'Ask someone else for the solution', 'Ignore it and hope it goes away'],
      }
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
      {
        id: 'feelingSafe',
        question: 'In your daily life, how often do you feel genuinely safe and at ease in your own body?',
        options: ['Most of the time', 'Sometimes', 'Rarely', 'Almost never'],
      },
      {
        id: 'emotionalExpression',
        question: 'Growing up, how was anger expressed in your family?',
        options: ['Openly and constructively', 'It was suppressed or denied', 'Through passive-aggression', 'In explosive or scary ways'],
      },
      {
        id: 'peoplePleasing',
        question: 'Do you find yourself often prioritizing others\' feelings and needs over your own?',
        options: ['Rarely, I\'m good at balancing', 'Sometimes, I try to be accommodating', 'Often, I feel responsible for others\' happiness', 'Almost always, it\'s how I feel safe'],
      },
      {
        id: 'receivingCare',
        question: 'How comfortable are you with letting others take care of you?',
        options: ['Very comfortable', 'A little awkward, but I allow it', 'Very uncomfortable, I prefer to be independent', 'I feel like a burden if others help me'],
      },
      {
        id: 'bodySensations',
        question: 'How connected do you feel to the physical sensations in your body?',
        options: ['Very connected, I notice things easily', 'Somewhat connected', 'I often feel disconnected or numb', 'I actively try to ignore my body'],
      },
      {
        id: 'conflictStyle',
        question: 'When conflict arises in a close relationship, what is your first impulse?',
        options: ['To talk it through (Fight)', 'To run away or shut down (Flight)', 'To give in or appease (Fawn)', 'To feel paralyzed or unable to react (Freeze)'],
      },
      {
        id: 'innerChild',
        question: 'How do you feel about the idea of an "inner child"?',
        options: ['I feel connected and caring toward my younger self', 'I\'m curious about it', 'It feels silly or strange to me', 'I feel distant or resentful toward my younger self'],
      },
      {
        id: 'playfulness',
        question: 'How much room is there for play, creativity, and spontaneity in your life?',
        options: ['A great deal', 'Some, but I wish there were more', 'Very little', 'Almost none'],
      },
      {
        id: 'shame',
        question: 'Do you often carry a feeling of being fundamentally "bad" or "broken"?',
        options: ['No, I see myself as a good person who makes mistakes', 'Sometimes that feeling creeps in', 'Yes, that feeling is often present', 'That feeling is a core part of who I am'],
      },
      {
        id: 'attachmentStyle',
        question: 'Which statement about relationships feels most true for you?',
        options: ['"I am confident that others will be there for me."', '"I worry my partner doesn\'t really love me."', '"I am more comfortable without close emotional ties."', '"My relationships feel chaotic and unstable."'],
      }
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
        {
          id: 'accessToEquipment',
          question: 'What kind of fitness equipment do you have access to?',
          options: ['Full gym access', 'Basic home equipment (dumbbells, bands)', 'Just my bodyweight', 'Cardio machines only (treadmill, bike)'],
        },
        {
          id: 'workoutTimeOfDay',
          question: 'What time of day are you most likely to exercise?',
          options: ['Early morning, before my day starts', 'During my lunch break', 'After work/in the evening', 'It varies greatly depending on the day'],
        },
        {
          id: 'pastInjuries',
          question: 'Do you have any past or current injuries I should be aware of?',
          options: ['No, I feel great', 'Yes, a past injury that sometimes flares up', 'Yes, a current injury I need to be careful with', 'I have chronic pain or a condition that limits movement'],
        },
        {
          id: 'fitnessMotivation',
          question: 'What is the "why" behind your desire to get fit?',
          options: ['To improve my physical health', 'To improve my mental health and reduce stress', 'To look better and feel more confident', 'To keep up with my kids/family'],
        },
        {
          id: 'musicPreference',
          question: 'What kind of music gets you pumped up for a workout?',
          options: ['High-energy pop or electronic', 'Rock or metal', 'Hip-hop', 'I prefer podcasts or silence'],
        },
        {
          id: 'postWorkoutFeeling',
          question: 'How do you want to feel after a workout?',
          options: ['Energized and ready to go', 'Calm and centered', 'Proud and accomplished', 'Pleasantly tired'],
        },
        {
          id: 'trackingStyle',
          question: 'How do you prefer to track your progress?',
          options: ['With data and numbers (weight, reps, time)', 'By how I feel in my body', 'By how my clothes fit', 'I don\'t like to track progress'],
        },
        {
          id: 'socialWorkout',
          question: 'Do you prefer working out alone or with others?',
          options: ['Alone - it\'s my "me time"', 'With a partner or friend', 'In a group class setting', 'A mix of both'],
        },
        {
          id: 'fitnessKnowledge',
          question: 'How would you rate your knowledge of proper exercise form?',
          options: ['Excellent, I\'m confident in my form', 'Good, but I could use some pointers', 'Fair, I\'m often unsure if I\'m doing it right', 'Poor, I need a lot of guidance'],
        },
        {
          id: 'restAndRecovery',
          question: 'How much attention do you pay to rest and recovery (e.g., stretching, sleep)?',
          options: ['It\'s a top priority', 'I do it sometimes', 'I often skip it', 'What\'s recovery?'],
        }
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
        {
          id: 'morningRoutine',
          question: 'What does your first hour of the day usually look like?',
          options: ['Structured and planned (exercise, meditation, etc.)', 'Rushed and chaotic', 'I hit snooze multiple times', 'I immediately check my phone/email'],
        },
        {
          id: 'paperClutter',
          question: 'How do you handle incoming mail and papers?',
          options: ['I have a system to sort it immediately', 'It piles up until I can\'t ignore it anymore', 'I have a "doom box" where it all goes', 'I\'m mostly paperless'],
        },
        {
          id: 'multitasking',
          question: 'How often do you find yourself multitasking?',
          options: ['Constantly, it\'s the only way to get things done', 'Frequently, but I know it\'s not ideal', 'Sometimes, on simple tasks', 'Rarely, I prefer to focus on one thing at a time'],
        },
        {
          id: 'decisionFatigue',
          question: 'How do you feel at the end of a day filled with many small decisions?',
          options: ['Energized', 'Fine, it\'s part of the day', 'Mentally drained', 'I tend to make poor choices by the end of the day'],
        },
        {
          id: 'weekendStyle',
          question: 'What is your ideal weekend?',
          options: ['Packed with social plans and activities', 'A good mix of chores and relaxation', 'Completely unplanned and spontaneous', 'Quiet and restorative, with lots of downtime'],
        },
        {
          id: 'delegation',
          question: 'How comfortable are you with delegating tasks to others (at work or home)?',
          options: ['Very comfortable, I do it often', 'I can, but I prefer to do it myself to get it right', 'I find it very difficult', 'I don\'t have anyone to delegate to'],
        },
        {
          id: 'sayingNo',
          question: 'You receive a non-urgent request that you don\'t have time for. What is your likely response?',
          options: ['"I can\'t right now, but maybe next week."', '"No, I don\'t have the bandwidth."', '"Yes." (and then I get stressed about it)', 'I ignore the request'],
        },
        {
          id: 'rememberingTasks',
          question: 'How do you remember all the things you need to do?',
          options: ['I use a digital app or to-do list', 'I write it down on paper/sticky notes', 'I just try to remember it all in my head', 'I frequently forget things'],
        },
        {
          id: 'unfinishedProjects',
          question: 'How many unfinished personal projects do you have right now?',
          options: ['None, I finish what I start', 'Just one or two', 'Several, it\'s a bit of a graveyard', 'I\'m afraid to count'],
        },
        {
          id: 'organizationTool',
          question: 'What is your primary organization tool?',
          options: ['A digital calendar', 'A physical planner/notebook', 'A to-do list app', 'My brain', 'I don\'t have one'],
        }
    ]
  },
  {
    agentId: 'spiritual-guide',
    title: 'Spiritual & Mindfulness Profile',
    description: 'This questionnaire is an invitation to explore your inner world. Answer in a way that feels true to you.',
    questions: [
      {
        id: 'mainSpiritualGoal',
        question: 'What are you seeking most on a spiritual or personal growth level right now?',
        options: ['A sense of inner peace', 'A deeper connection to the world around me', 'Clarity on my life\'s purpose', 'A way to manage overwhelming thoughts', 'I\'m just exploring and open to anything'],
      },
      {
        id: 'mindfulnessExperience',
        question: 'What is your experience with meditation or mindfulness practices?',
        options: ['I practice regularly', 'I\'ve tried it a few times', 'I\'m curious but don\'t know where to start', 'It feels difficult or unappealing to me'],
      },
      {
        id: 'connectionToNature',
        question: 'How connected do you feel to the natural world?',
        options: ['Very connected, I spend a lot of time in nature', 'Somewhat connected', 'Not very connected', 'I rarely think about it'],
      },
      {
        id: 'innerCriticVolume',
        question: 'How loud is your "inner critic" on an average day?',
        options: ['Mostly quiet', 'A gentle whisper', 'A constant background noise', 'Very loud and demanding'],
      },
      {
        id: 'gratitudePractice',
        question: 'Do you have a gratitude practice (e.g., journaling, thinking of things you\'re thankful for)?',
        options: ['Yes, regularly', 'Sometimes', 'Rarely', 'No'],
      },
    ]
  },
  {
    agentId: 'relationships-coach',
    title: 'Relationship Dynamics Profile',
    description: 'This questionnaire will help your AI Relationships Coach understand your patterns and goals in connecting with others.',
    questions: [
      {
        id: 'primaryRelationshipGoal',
        question: 'What is your primary goal for your relationships right now?',
        options: ['Building deeper connections with friends/family', 'Improving communication with my partner', 'Navigating the dating world more confidently', 'Understanding my own patterns in relationships', 'Setting healthier boundaries'],
      },
      {
        id: 'communicationStyle',
        question: 'How do you typically handle disagreements in a close relationship?',
        options: ['I tend to avoid conflict', 'I want to talk it out and resolve it right away', 'I get angry or defensive', 'I shut down and need space'],
      },
      {
        id: 'expressingNeeds',
        question: 'How easy is it for you to ask for what you need from others?',
        options: ['Very easy, I\'m direct', 'Challenging, I worry about being a burden', 'Very difficult, I usually just do it myself', 'I\'m not always sure what I need'],
      },
      {
        id: 'receivingFeedback',
        question: 'How do you typically react when receiving criticism or feedback from someone you care about?',
        options: ['I listen openly and consider it', 'I feel defensive and want to explain myself', 'I feel hurt or rejected', 'I dismiss it if I don\'t agree'],
      },
      {
        id: 'attachmentAnxiety',
        question: 'In a romantic relationship, which thought is more common for you?',
        options: ['"I hope they don\'t leave me."', '"I need my space and independence."', '"We are a solid team."', '"I often feel misunderstood."'],
      },
    ]
  }
];
