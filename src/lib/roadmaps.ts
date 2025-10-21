
export type ModuleQuestion = {
    id: string;
    question: string;
    options: string[];
};

export type Module = {
    title: string;
    completed: boolean;
    steps: {
        identify: string;
        trigger: string;
        origin: string;
        behavior_change: string;
        daily_task: string;
        short_term_goal: string;
        long_term_goal: string;
    },
    questions: ModuleQuestion[];
}

export type Roadmaps = Record<string, Module[]>;


export const roadmaps: Roadmaps = {
  nutritionist: [
    {
      "title": "Your Relationship with Food",
      "completed": false,
      "steps": {
        "identify": "Explore your primary relationship with food. Is it fuel, comfort, a source of stress, or something else?",
        "trigger": "Pinpoint specific situations, emotions, or times of day that trigger mindless eating or unhealthy cravings.",
        "origin": "Gently reflect on your earliest memory of using food for something other than hunger (e.g., for comfort, as a reward).",
        "behavior_change": "Introduce the practice of 'mindful eating' to pay full attention to the experience of eating.",
        "daily_task": "Practice the 'One-Minute Arrival': Before one meal, pause, breathe, and notice your hunger level.",
        "short_term_goal": "Keep a judgment-free journal of what you eat and your emotions before and after.",
        "long_term_goal": "Develop an intuitive eating pattern where you confidently respond to your body's cues."
      },
      "questions": [
        {
          "id": "food_primary_role",
          "question": "Which of these best describes the primary role food plays in your life right now?",
          "options": ["It's fuel, I eat for energy", "It's a source of comfort or a reward", "It's a source of stress or anxiety", "It's a social activity"]
        },
        {
          "id": "mindless_eating_frequency",
          "question": "How often do you find yourself eating without really paying attention (e.g., while watching TV, working)?",
          "options": ["Rarely or never", "A few times a week", "At least once a day", "Most of my meals are like this"]
        }
      ]
    },
    {
      "title": "Understanding Macronutrients",
      "completed": false,
      "steps": {
        "identify": "Clarify the roles of protein, fats, and carbohydrates in your diet and energy levels.",
        "trigger": "Identify energy slumps or cravings related to imbalanced meals.",
        "origin": "Think back to when you first learned about \"good\" vs. \"bad\" foods. How has that influenced your choices?",
        "behavior_change": "Learn to build balanced plates for sustained energy.",
        "daily_task": "Aim to include a source of protein in every meal.",
        "short_term_goal": "Plan and prepare three balanced lunches for the upcoming week.",
        "long_term_goal": "Feel confident in creating balanced meals without strict counting or measuring."
      },
      "questions": [
        {
            "id": "energy_crashes",
            "question": "How often do you experience energy crashes or slumps during the day?",
            "options": ["Rarely ever", "A few times a week", "Almost daily", "Multiple times a day"]
        },
        {
            "id": "meal_composition",
            "question": "When you look at your typical lunch or dinner, which of these is usually the largest portion?",
            "options": ["Protein (meat, fish, beans)", "Carbohydrates (bread, pasta, rice, potatoes)", "Vegetables or salad", "Fats (sauces, oils, cheese)"]
        }
      ]
    },
    {
        "title": "The Importance of Hydration",
        "completed": false,
        "steps": {
          "identify": "Assess your current daily water intake and its effects on energy and concentration.",
          "trigger": "Identify reasons for forgetting to drink water (e.g., busy schedule, lack of access).",
          "origin": "Recall your childhood habits around drinking water versus other beverages like juice or soda.",
          "behavior_change": "Implement strategies to make hydration a consistent habit.",
          "daily_task": "Carry a reusable water bottle with you throughout the day.",
          "short_term_goal": "Track your water intake for one week to establish a baseline.",
          "long_term_goal": "Maintain optimal hydration levels as a natural part of your daily routine."
        },
        "questions": [
          {
            "id": "daily_water_intake",
            "question": "Honestly, about how many glasses of plain water do you drink on an average day?",
            "options": ["0-1 glasses", "2-4 glasses", "5-7 glasses", "8 or more glasses"]
          },
          {
            "id": "hydration_symptoms",
            "question": "Which of these do you experience regularly?",
            "options": ["Headaches or brain fog", "Daytime sleepiness", "Dark colored urine", "None of these"]
          }
        ]
      },
      {
        "title": "Decoding Sugar Cravings",
        "completed": false,
        "steps": {
          "identify": "Understand the root causes of your sugar cravings (e.g., habit, stress, low blood sugar).",
          "trigger": "Note the time of day and emotional state when sugar cravings are strongest.",
          "origin": "What is your earliest memory of sugar being used as a major treat or reward?",
          "behavior_change": "Develop a toolkit of healthy alternatives and strategies to manage cravings.",
          "daily_task": "When a craving hits, pause and ask yourself what you're truly needing in that moment.",
          "short_term_goal": "Swap one sugary snack per day for a healthier alternative like fruit or nuts.",
          "long_term_goal": "Reduce reliance on sugar for energy or emotional comfort."
        },
        "questions": [
          {
            "id": "craving_trigger_time",
            "question": "When are your sugar cravings most intense?",
            "options": ["In the afternoon", "After dinner / late at night", "When I'm stressed or bored", "They are constant throughout the day"]
          },
          {
            "id": "craving_type",
            "question": "What kind of sugary item do you crave most often?",
            "options": ["Candy or chocolate", "Baked goods (cakes, cookies)", "Sugary drinks (soda, juice)", "Ice cream"]
          }
        ]
      }
  ],
  psychologist: [
    {
      "title": "Understanding & Managing Anxiety",
      "completed": false,
      "steps": {
        "identify": "Map out your anxiety: the physical sensations, emotions, and thoughts it creates.",
        "trigger": "Identify specific external triggers (situations, people) and internal triggers (thoughts, memories) that provoke anxiety.",
        "origin": "Gently explore your earliest memory of feeling this specific type of anxiety. What was happening at that time in your life?",
        "behavior_change": "Practice 'grounding' techniques to pull out of anxious thought loops and back to the present moment.",
        "daily_task": "Practice the '5-4-3-2-1 Grounding Technique' once a day.",
        "short_term_goal": "For one week, log moments of anxiety and the trigger that preceded it.",
        "long_term_goal": "Develop a personalized 'anxiety toolkit' of coping strategies you can deploy confidently."
      },
      "questions": [
        {
          "id": "anxiety_level_past_week",
          "question": "On a scale of 1 to 5, how would you rate your general anxiety level over the past week?",
          "options": ["1 - Calm and at ease", "2 - Mildly anxious at times", "3 - Moderately anxious, it was noticeable", "4 - Highly anxious, it interfered with my day", "5 - Severely anxious, it was overwhelming"]
        },
        {
          "id": "anxiety_physical_symptoms",
          "question": "When you felt anxious this week, what was the most common physical symptom?",
          "options": ["Racing heart", "Tightness in chest or throat", "Stomach unease", "Restlessness or fidgeting", "I didn't notice physical symptoms"]
        }
      ]
    },
    {
      "title": "Exploring Core Beliefs",
      "completed": false,
      "steps": {
        "identify": "Uncover the fundamental beliefs you hold about yourself, others, and the world.",
        "trigger": "Recognize situations where a negative core belief (e.g., \"I'm not good enough\") is activated.",
        "origin": "Where did this belief come from? Can you recall a specific time, event, or relationship where this idea first took root?",
        "behavior_change": "Learn to question and challenge these long-held beliefs with evidence.",
        "daily_task": "Identify one thought today that stems from a core belief.",
        "short_term_goal": "Write down a core belief and find three pieces of evidence from your life that contradict it.",
        "long_term_goal": "Gradually replace rigid, negative core beliefs with more flexible and compassionate ones."
      },
      "questions": [
        {
            "id": "self_talk_theme",
            "question": "What was the dominant theme of your inner self-talk this week?",
            "options": ["Mostly supportive and kind", "Neutral and descriptive", "Mostly critical and self-doubting", "I wasn't paying attention to it"]
        },
        {
            "id": "core_belief_activation",
            "question": "Think of a recent moment you felt upset. The underlying thought was most likely...",
            "options": ["\"I am not good enough.\"", "\"I am unlovable.\"", "\"I am a failure.\"", "\"The world is a dangerous place.\""]
        }
      ]
    },
    {
      "title": "Setting Healthy Boundaries",
      "completed": false,
      "steps": {
        "identify": "Identify one area in your life (work, family, friends) where boundaries feel weak or non-existent.",
        "trigger": "Recognize feelings of resentment, frustration, or burnout as signs of a boundary being crossed.",
        "origin": "Think about your childhood. Were you taught that it was selfish to say \"no\"? Were your own boundaries respected?",
        "behavior_change": "Practice formulating and communicating a boundary in a clear, respectful way.",
        "daily_task": "Say \"no\" to one small, low-stakes request.",
        "short_term_goal": "Communicate one boundary to a safe person in your life.",
        "long_term_goal": "Feel empowered to set and maintain boundaries that protect your energy and well-being."
      },
      "questions": [
        {
            "id": "boundary_challenge_area",
            "question": "In which area of your life did you feel your boundaries were most challenged this week?",
            "options": ["Work or career", "Family relationships", "Friendships", "Romantic relationships"]
        },
        {
            "id": "difficulty_saying_no",
            "question": "How many times this week did you say \"yes\" to something when you wanted to say \"no\"?",
            "options": ["Zero - I was great at it!", "1-2 times", "3-5 times", "More than 5 times"]
        }
      ]
    }
  ],
  'cbt-therapist': [],
  'trauma-therapist': [],
  'fitness-instructor': [],
  'personal-life-manager': [],
  'spiritual-guide': [
    {
        "title": "Finding Stillness in a Busy World",
        "completed": false,
        "steps": {
            "identify": "Acknowledge the feeling of being constantly rushed or mentally cluttered.",
            "trigger": "Notice the moments when you feel most scattered—is it during work, commuting, or even leisure time?",
            "origin": "Reflect on when you first learned that being 'busy' was a sign of being 'productive' or 'valuable'.",
            "behavior_change": "Practice the 'moment of pause'—a single, conscious breath taken at various points throughout the day to anchor yourself in the present.",
            "daily_task": "Take one mindful breath before you start your computer or check your phone in the morning.",
            "short_term_goal": "Find three opportunities in your day to take a 'moment of pause' for one week.",
            "long_term_goal": "Cultivate a sense of inner spaciousness, even when your external world is busy."
        },
        "questions": [
            {
                "id": "mental_clutter",
                "question": "How would you describe the state of your mind on an average day?",
                "options": ["Calm and clear", "A gentle stream of thoughts", "Busy and cluttered", "Chaotic and overwhelming"]
            },
            {
                "id": "moments_of_stillness",
                "question": "How often do you intentionally take moments for quiet or stillness in your day?",
                "options": ["Several times a day", "Once a day", "A few times a week", "Rarely or never"]
            }
        ]
    }
  ],
  'relationships-coach': [
    {
        "title": "Navigating Difficult Conversations",
        "completed": false,
        "steps": {
            "identify": "Recognize your current pattern during conflict (e.g., shutting down, getting angry, people-pleasing).",
            "trigger": "Pinpoint the specific topics or types of people that make you feel most defensive or anxious.",
            "origin": "Think back to how conflict was handled in your family growing up. What did you learn about disagreement?",
            "behavior_change": "Practice using 'I feel' statements to express your perspective without blame (e.g., 'I feel unheard when...' instead of 'You never listen...').",
            "daily_task": "Identify one feeling you have today and state it to yourself as an 'I feel...' statement.",
            "short_term_goal": "Use an 'I feel' statement in a low-stakes conversation with a safe person.",
            "long_term_goal": "Confidently navigate difficult conversations while staying connected to the other person."
        },
        "questions": [
            {
                "id": "conflict_style",
                "question": "When a disagreement arises with someone close to you, what is your most common initial reaction?",
                "options": ["I try to solve the problem immediately.", "I need space and tend to withdraw.", "I get anxious and try to smooth things over.", "I get angry and defensive."]
            },
            {
                "id": "expressing_needs",
                "question": "How easy is it for you to express your needs in a relationship?",
                "options": ["Very easy", "It's a bit challenging", "It's very difficult", "I'm not even sure what my needs are"]
            }
        ]
    }
  ],
};
