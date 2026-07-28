import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowedEmail = "a.abdelsamie.dev@gmail.com";
      // Allow only the specific email to log in
      if (user.email === allowedEmail) {
        return true;
      } else {
        // Return false to display a default error page, 
        // or throw an Error to send them back to the login page with an error.
        return false;
      }
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
