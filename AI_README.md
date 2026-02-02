# AI Recommendation Approach

This project implements a local, algorithmic approach to AI features, prioritizing privacy and fundamental computer science concepts (Vector Space Modelling, NLP) over external API calls.

## Core Features Implemented

### 1. Content Analysis using NLP
- **Goal**: Understand spending context beyond simple categories.
- **Implementation**: 
  - We use a custom **Tokenizer** to strip punctuation and remove stop words (e.g., "the", "at").
  - The system analyzes the frequency of tokens in transaction descriptions.
  - **Result**: It detects habits like frequent "Coffee" or "Uber" charges, providing insights like *"You passed 15 transactions related to Coffee"*.

### 2. User Preference Modelling
- **Goal**: Create a mathematical representation of the user's financial behavior.
- **Implementation**: 
  - We build a **Spending Vector** (Feature Vector) for each user.
  - The vector is normalized ($ \frac{CategoryAmount}{TotalAmount} $) to represent distribution rather than raw volume.
  - Example Vector: `v = { Rent: 0.3, Food: 0.2, Entertainment: 0.5 }`
  - **Result**: The system creates a quantifiable profile of the user that can be used for comparison and clustering.

### 3. Similarity-based Recommendation Algorithm
- **Goal**: Compare the user against an "Ideal Saver" profile.
- **Implementation**:
  - We define an **Ideal Vector** ($ I $) based on the 50/30/20 rule (50% needs, 30% wants, 20% savings).
  - We calculate the **Cosine Similarity** between the User Vector ($ U $) and Ideal Vector ($ I $).
  - Formula: 
    $$ \text{similarity} = \cos(\theta) = \frac{U \cdot I}{\|U\| \|I\|} $$
  - **Result**: A similarity score (0 to 1) that indicates how financially "healthy" the user's spending habits are, triggering tailored advice if the angle between vectors is too large.
