# Nutrition System Complete Guide

## Overview

The nutrition system consists of two main components:
1. **Nutrition Items** - Database of food items with nutritional information
2. **Nutrition Logs** - User meal tracking and logging

## System Architecture

### Models

#### 1. NutritionItem Model (`nutritionitem.model.js`)
**Purpose**: Master database of food items with complete nutritional information

**Fields**:
- **Identification**: `foodId`, `name`, `slug`
- **Category**: `category` (protein, carbs, fats, vegetables, fruits, dairy, grains, snacks, beverages)
- **Macronutrients**: `calories`, `protein`, `carbs`, `fats`, `fiber`, `sugar`
- **Micronutrients**: `vitamins` (JSON), `minerals` (JSON)
- **Dietary Info**: `isVegetarian`, `isVegan`, `isGlutenFree`, `isDairyFree`, `isKeto`
- **Allergens**: `allergens` (JSON array)
- **Meal Types**: `mealTypes` (JSON array)
- **Goals**: `goals` (JSON array)
- **Additional**: `preparationTime`, `cost`, `tags`, `popularityScore`
- **Media**: `imageUrl`, `thumbnailUrl`, `videoUrl`

#### 2. NutritionLog Model (`nutrition.model.js`)
**Purpose**: User meal tracking and daily nutrition logging

**Fields**:
- **User**: `userId`
- **Meal Info**: `date`, `mealType`, `foodName`, `servingSize`
- **Macros**: `calories`, `protein`, `carbs`, `fats`, `fiber`, `sugar`, `sodium`
- **Micronutrients**: `vitamins` (JSON), `minerals` (JSON)
- **Additional**: `waterIntake`, `imageUrl`, `notes`

### Controllers

#### 1. NutritionItem Controller (`nutritionitem.controller.js`)
**Endpoints**:
- `GET /api/nutrition-items` - Get all items with filters
- `GET /api/nutrition-items/:id` - Get single item (by ID or slug)
- `GET /api/nutrition-items/categories` - Get categories with counts
- `GET /api/nutrition-items/popular` - Get popular items
- `GET /api/nutrition-items/search` - Search items
- `POST /api/nutrition-items` - Create item (Admin)
- `PUT /api/nutrition-items/:id` - Update item (Admin)
- `DELETE /api/nutrition-items/:id` - Delete item (Admin)

#### 2. Nutrition Controller (`nutrition.controller.js`)
**Endpoints**:
- `GET /api/nutrition` - Get user's nutrition logs
- `GET /api/nutrition/:id` - Get single log
- `GET /api/nutrition/daily` - Get daily summary
- `GET /api/nutrition/weekly` - Get weekly summary
- `GET /api/nutrition/stats` - Get nutrition statistics
- `POST /api/nutrition` - Log a meal
- `PUT /api/nutrition/:id` - Update log
- `DELETE /api/nutrition/:id` - Delete log

## Database Setup

### 1. Create Tables

Run migrations to create the tables:

```bash
# The tables will be created automatically by Sequelize when the server starts
# Or run sync manually:
node -e "require('./src/config/database').sequelize.sync()"
```

### 2. Seed Nutrition Items

```bash
# Navigate to seeders directory
cd backend/src/seeders

# Run the SQL seed file
mysql -u your_username -p your_database < nutrition-seed.sql

# Or use your database client to execute the file
```

### 3. Verify Data

```sql
SELECT 
  COUNT(*) as total_foods,
  SUM(CASE WHEN isVegetarian = TRUE THEN 1 ELSE 0 END) as vegetarian_count,
  SUM(CASE WHEN isVegan = TRUE THEN 1 ELSE 0 END) as vegan_count,
  SUM(CASE WHEN isKeto = TRUE THEN 1 ELSE 0 END) as keto_count
FROM nutrition_items;
```

## API Usage Examples

### Get All Nutrition Items

```javascript
// Get all items
GET /api/nutrition-items

// Filter by category
GET /api/nutrition-items?category=protein

// Filter by dietary preferences
GET /api/nutrition-items?isVegan=true&isGlutenFree=true

// Search
GET /api/nutrition-items?search=chicken

// Pagination and sorting
GET /api/nutrition-items?page=1&limit=20&sortBy=popularityScore&sortOrder=DESC
```

### Get Single Item

```javascript
// By ID
GET /api/nutrition-items/1

// By slug
GET /api/nutrition-items/grilled-chicken-breast
```

### Create Nutrition Item (Admin)

```javascript
POST /api/nutrition-items
Authorization: Bearer {admin_token}

{
  "foodId": "food_016",
  "name": "Grilled Salmon",
  "category": "protein",
  "servingSize": "150g",
  "calories": 280,
  "protein": 39,
  "carbs": 0,
  "fats": 13,
  "fiber": 0,
  "sugar": 0,
  "isVegetarian": false,
  "isVegan": false,
  "isGlutenFree": true,
  "isKeto": true,
  "allergens": ["fish"],
  "mealTypes": ["lunch", "dinner"],
  "goals": ["muscle_gain", "heart_health"],
  "tags": ["high_protein", "omega3"],
  "popularityScore": 88
}
```

### Log a Meal (User)

```javascript
POST /api/nutrition
Authorization: Bearer {user_token}

{
  "mealType": "breakfast",
  "foodName": "Greek Yogurt with Berries",
  "servingSize": "1 cup",
  "calories": 150,
  "protein": 20,
  "carbs": 15,
  "fats": 2,
  "fiber": 3,
  "sugar": 10
}
```

### Get Daily Summary

```javascript
GET /api/nutrition/daily?date=2024-12-11
Authorization: Bearer {user_token}

Response:
{
  "success": true,
  "data": {
    "summary": {
      "date": "2024-12-11",
      "totalCalories": 2150,
      "totalProtein": 165,
      "totalCarbs": 180,
      "totalFats": 65,
      "mealCount": 5,
      "mealsByType": {
        "breakfast": 1,
        "lunch": 1,
        "dinner": 1,
        "snack": 2
      }
    },
    "logs": [...]
  }
}
```

## Admin Panel Integration

### Frontend API (`api.ts`)

The nutrition items API has been added to the admin panel:

```typescript
import { nutritionItemAPI } from '@/lib/api';

// Get all nutrition items
const items = await nutritionItemAPI.getNutritionItems({
  category: 'protein',
  isVegan: true
});

// Get single item
const item = await nutritionItemAPI.getNutritionItem('grilled-chicken-breast');

// Create new item (admin)
await nutritionItemAPI.createNutritionItem({
  foodId: 'food_016',
  name: 'Grilled Salmon',
  category: 'protein',
  calories: 280,
  // ... other fields
});

// Update item
await nutritionItemAPI.updateNutritionItem(1, { calories: 285 });

// Delete item
await nutritionItemAPI.deleteNutritionItem(1);
```

### Create Nutrition View Component

You can create a new admin panel view similar to `ExercisesView.tsx`:

```typescript
// admin-panel/src/components/admin/NutritionView.tsx
import { nutritionItemAPI } from '@/lib/api';

export const NutritionView = () => {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    loadNutritionItems();
  }, []);
  
  const loadNutritionItems = async () => {
    const response = await nutritionItemAPI.getNutritionItems();
    setItems(response.data.data);
  };
  
  // ... rest of component
};
```

## Data Structure

### Nutrition Item Example

```json
{
  "id": 1,
  "foodId": "food_001",
  "name": "Grilled Chicken Breast",
  "slug": "grilled-chicken-breast",
  "category": "protein",
  "servingSize": "100g",
  "calories": 165,
  "protein": 31,
  "carbs": 0,
  "fats": 3.6,
  "fiber": 0,
  "sugar": 0,
  "vitamins": {
    "B6": 0.5,
    "B12": 0.3,
    "niacin": 14
  },
  "minerals": {
    "iron": 1,
    "zinc": 1.5,
    "selenium": 27
  },
  "isVegetarian": false,
  "isVegan": false,
  "isGlutenFree": true,
  "isDairyFree": true,
  "isKeto": true,
  "allergens": [],
  "mealTypes": ["lunch", "dinner", "post_workout"],
  "goals": ["muscle_gain", "weight_loss", "maintenance"],
  "preparationTime": 15,
  "cost": "medium",
  "tags": ["high_protein", "low_carb", "lean"],
  "popularityScore": 92,
  "imageUrl": "/images/nutrition/grilled-chicken-breast/main.jpg",
  "thumbnailUrl": "/images/nutrition/grilled-chicken-breast/thumbnail.jpg",
  "isActive": true,
  "createdAt": "2024-12-11T00:00:00.000Z",
  "updatedAt": "2024-12-11T00:00:00.000Z"
}
```

## Categories

- **protein**: Meat, fish, eggs, protein supplements
- **carbs**: Rice, pasta, bread, grains
- **fats**: Nuts, oils, avocado, fatty fish
- **vegetables**: All vegetables
- **fruits**: All fruits
- **dairy**: Milk, cheese, yogurt
- **grains**: Oats, quinoa, whole grains
- **snacks**: Healthy snacks
- **beverages**: Drinks, smoothies

## Meal Types

- `breakfast`
- `lunch`
- `dinner`
- `snack`
- `pre_workout`
- `post_workout`

## Goals

- `muscle_gain`
- `weight_loss`
- `endurance`
- `heart_health`
- `brain_health`
- `gut_health`
- `immune_health`
- `maintenance`
- `recovery`
- `energy`

## Image/Video Upload Integration

Nutrition items support media uploads similar to exercises:

1. **Image Upload**: Use the existing image upload system
2. **Folder Structure**: `/images/nutrition/{food-slug}/`
3. **Video Support**: Can add preparation/demo videos

### Example Folder Structure

```
public/images/nutrition/
├── grilled-chicken-breast/
│   ├── main.jpg
│   ├── thumbnail.jpg
│   └── preparation.mp4
├── brown-rice/
│   ├── main.jpg
│   └── thumbnail.jpg
└── salmon-fillet/
    ├── main.jpg
    ├── thumbnail.jpg
    └── cooking-demo.mp4
```

## Testing

### Test Nutrition Items API

```bash
# Get all items
curl http://localhost:5000/api/nutrition-items

# Get protein items
curl http://localhost:5000/api/nutrition-items?category=protein

# Search
curl http://localhost:5000/api/nutrition-items/search?q=chicken

# Get categories
curl http://localhost:5000/api/nutrition-items/categories
```

### Test Nutrition Logs API

```bash
# Log a meal (requires authentication)
curl -X POST http://localhost:5000/api/nutrition \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mealType": "breakfast",
    "foodName": "Oatmeal",
    "calories": 166,
    "protein": 6,
    "carbs": 28
  }'

# Get daily summary
curl http://localhost:5000/api/nutrition/daily?date=2024-12-11 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps

1. **Create Admin Panel View**: Build a nutrition items management interface
2. **Add Image Upload**: Integrate with the existing image upload system
3. **Create User Interface**: Build meal logging interface for users
4. **Add Meal Plans**: Create pre-made meal plans using nutrition items
5. **Add Recipes**: Create recipes combining multiple nutrition items
6. **Add Barcode Scanner**: Scan food barcodes to auto-fill nutrition data

## Files Created

### Backend
- ✅ `src/models/nutritionitem.model.js` - Nutrition items model
- ✅ `src/controllers/nutritionitem.controller.js` - Nutrition items controller
- ✅ `src/routes/nutritionitem.routes.js` - Nutrition items routes
- ✅ `src/seeders/nutrition-seed.sql` - SQL seed file with 15 food items
- ✅ `src/server.js` - Updated with nutrition items route
- ✅ `src/models/index.js` - Updated with NutritionItem export

### Frontend
- ✅ `admin-panel/src/lib/api.ts` - Added nutritionItemAPI

### Documentation
- ✅ `NUTRITION_SYSTEM_GUIDE.md` - This guide

## Summary

The nutrition system is now fully integrated with:
- ✅ Database model for nutrition items
- ✅ Complete CRUD API for nutrition items
- ✅ SQL seed file with 15 food items
- ✅ Frontend API integration
- ✅ Existing nutrition logging system
- ✅ Support for dietary filters (vegan, keto, etc.)
- ✅ Search and categorization
- ✅ Media upload support ready

You can now:
1. Run the SQL seed file to populate the database
2. Access nutrition items via API
3. Build admin panel views to manage items
4. Create user interfaces for meal logging
5. Upload images/videos for food items

---

**Last Updated**: December 2024
**Version**: 1.0.0
