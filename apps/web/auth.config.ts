import Credentials from "next-auth/providers/credentials";

export default {
    providers: [
        Credentials({
            async authorize(credentials)  {
                
            }
        })
    ],
}