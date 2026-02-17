import { User, Community, CommunityMember, LearningGoal, Match, Conversation, Message, ConversationSummary } from "./schema";
import mongoose from "mongoose";
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!

const freeUsers = [
  { clerkId: "free_001", email: "free1@email.com", name: "Free User One", subscriptionTier: "free" },
  { clerkId: "free_002", email: "free2@email.com", name: "Free User Two", subscriptionTier: "free" },
  { clerkId: "free_003", email: "free3@email.com", name: "Free User Three", subscriptionTier: "free" },
];

const proUsers = [
  { clerkId: "pro_001_temp", email: "itskulkarniankita@gmail.com", name: "Ankita Kulkarni", subscriptionTier: "pro" },
  { clerkId: "pro_002_temp", email: "kulkarni.ankita09@gmail.com", name: "Ankita K", subscriptionTier: "pro" },
  { clerkId: "pro_003", email: "emma.chen@email.com", name: "Emma Chen (Pro)", subscriptionTier: "pro" },
];

const communitiesData = [
  { name: "Modern Full Stack Next.js Course", description: "Build production-ready full-stack applications with Next.js, React, TypeScript, and modern tools" },
  { name: "Developer to Leader", description: "Transition from senior developer to tech lead and engineering manager" },
  { name: "Ankita's Youtube Community", description: "Community for Ankita's YouTube channel followers" },
];

async function comprehensiveSeed() {
  console.log("🌱 Starting comprehensive database seed (MongoDB/Mongoose)...");

  try {
    await mongoose.connect(connectionString);

    // 0. Clear existing data
    console.log("🗑️  Clearing existing database data...");
    await ConversationSummary.deleteMany({});
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    await Match.deleteMany({});
    await LearningGoal.deleteMany({});
    await CommunityMember.deleteMany({});
    await Community.deleteMany({});
    await User.deleteMany({});

    // 1. Create users
    const createdUsers = await User.insertMany([...freeUsers, ...proUsers]);
    console.log(`   ✓ Created ${createdUsers.length} users`);

    // 2. Create communities
    const createdCommunities = await Community.insertMany(communitiesData.map(c => ({
      ...c,
      createdBy: createdUsers.find(u => u.subscriptionTier === 'pro')?._id
    })));
    console.log(`   ✓ Created ${createdCommunities.length} communities`);

    // 3. Add users to communities
    for (const user of createdUsers) {
      // Everyone joins the first community
      await CommunityMember.create({
        userId: user._id,
        communityId: createdCommunities[0]._id
      });
    }
    console.log("   ✓ Added users to communities");

    // 4. Create sample matches
    const user1 = createdUsers[0];
    const user2 = createdUsers[createdUsers.length - 1];
    const match = await Match.create({
      user1Id: user1._id,
      user2Id: user2._id,
      communityId: createdCommunities[0]._id,
      status: 'accepted'
    });
    console.log("   ✓ Created sample match");

    // 5. Create conversation
    const conversation = await Conversation.create({
      matchId: match._id,
      lastMessageAt: new Date()
    });
    console.log("   ✓ Created sample conversation");

    // 6. Create messages
    await Message.create([
      { conversationId: conversation._id, senderId: user1._id, content: "Hello! Ready to learn?" },
      { conversationId: conversation._id, senderId: user2._id, content: "Yes, definitely!" }
    ]);
    console.log("   ✓ Created sample messages");

    console.log("\n✨ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    process.exit(1);
  }
}

comprehensiveSeed();
