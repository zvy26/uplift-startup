import { AuthContext } from "./authContext";

type Props = {
  children: React.ReactNode;
};

export function AuthConsumer({ children }: Props) {
  return (
    <AuthContext.Consumer>
      {(auth) => (auth.loading ? "loading" : children)}
    </AuthContext.Consumer>
  );
}
