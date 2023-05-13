import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import User from '@models/user'
import { connectToDB } from "@utility/database/conn.js";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email })
      session.user.id = sessionUser?._id.toString()
      return session
    },
    async signIn({ profile }) {
      try {
        await connectToDB()

        await User.updateOne({ email: profile.email },{$set: {userName: profile.name.replace(" ", "").toLowerCase(),image: profile.picture}},{upsert:true})

        return true
      } catch (error) {
        console.log(error);
        return false
      }
    }
  },
})

export { handler as GET, handler as POST }