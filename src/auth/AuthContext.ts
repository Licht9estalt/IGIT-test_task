import { createContext } from 'react';

const AuthContext = createContext<
	| {
			isAuth: boolean;
			login: () => void;
			logout: () => void;
	  }
	| undefined
>(undefined);

export default AuthContext;
