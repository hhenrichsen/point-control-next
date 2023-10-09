import { signIn, signOut, useSession } from "next-auth/react";

export default function Auth(): JSX.Element {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => void signOut()} type="button">
          Sign out
        </button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => void signIn()} type="button">
        Sign in
      </button>
    </>
  );
}
