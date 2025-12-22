// scripts/migrate-add-uncategorized.ts
// ==========================================
// Run this script ONCE to add "Uncategorized" category to existing users
// and fix any orphaned tasks

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local or .env
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

import mongoose from 'mongoose';

// Define minimal schema types for the migration (no need to import full models)
const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
});

const CategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  color: String,
  icon: String,
  isDefault: Boolean,
  isUncategorized: Boolean,
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  title: String,
  status: String,
}, { timestamps: true });

// Get or create models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      '❌ MONGODB_URI environment variable is not defined.\n' +
      '   Please add it to your .env.local or .env file:\n' +
      '   MONGODB_URI=mongodb+srv://...'
    );
  }

  if (mongoose.connection.readyState === 1) {
    console.log('✅ Already connected to database');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

async function migrateAddUncategorized() {
  console.log('🚀 Starting migration: Add Uncategorized category');
  console.log('='.repeat(50));
  
  try {
    await connectDB();

    // Get all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users\n`);

    if (users.length === 0) {
      console.log('⚠️  No users found in database');
      console.log('   This is normal for a fresh database');
      return;
    }

    let categoriesCreated = 0;
    let tasksFixed = 0;

    for (const user of users) {
      const userEmail = user.email || user._id.toString();
      console.log(`👤 Processing user: ${userEmail}`);

      // Check if user already has an "Uncategorized" category
      let uncategorized = await Category.findOne({
        userId: user._id,
        isUncategorized: true,
      });

      if (!uncategorized) {
        // Create the Uncategorized category
        uncategorized = await Category.create({
          userId: user._id,
          name: 'Uncategorized',
          color: '#6B7280',
          icon: '📋',
          isDefault: true,
          isUncategorized: true,
        });
        categoriesCreated++;
        console.log(`  ✅ Created "Uncategorized" category`);
      } else {
        console.log(`  ℹ️  "Uncategorized" category already exists`);
      }

      // Find all valid category IDs for this user
      const validCategories = await Category.find({ userId: user._id }).select('_id');
      const validCategoryIds = validCategories.map(cat => cat._id.toString());

      // Find tasks with invalid categories
      const userTasks = await Task.find({ userId: user._id });
      const orphanedTasks = userTasks.filter(task => {
        const taskCatId = task.categoryId?.toString();
        return taskCatId && !validCategoryIds.includes(taskCatId);
      });

      if (orphanedTasks.length > 0) {
        // Reassign orphaned tasks to "Uncategorized"
        const result = await Task.updateMany(
          {
            _id: { $in: orphanedTasks.map(t => t._id) }
          },
          { $set: { categoryId: uncategorized._id } }
        );
        
        tasksFixed += result.modifiedCount;
        console.log(`  🔧 Fixed ${result.modifiedCount} orphaned task(s)`);
      } else {
        console.log(`  ✓ No orphaned tasks found`);
      }

      console.log(''); // Empty line for readability
    }

    console.log('='.repeat(50));
    console.log('✅ Migration completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users processed: ${users.length}`);
    console.log(`   - "Uncategorized" categories created: ${categoriesCreated}`);
    console.log(`   - Orphaned tasks fixed: ${tasksFixed}`);
    console.log('='.repeat(50));

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    throw error;
  }
}

// Run the migration
if (require.main === module) {
  migrateAddUncategorized()
    .then(() => {
      console.log('\n✅ Migration script finished successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration script failed');
      console.error(error);
      process.exit(1);
    });
}

export default migrateAddUncategorized;