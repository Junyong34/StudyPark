### nextjs HOC를 사용해 login 검증 하기

```javascript
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// This is a HOC that will wrap the component that requires authentication
const withAuth = (WrappedComponent: React.ComponentType) => {
  // Return a new component
  return (props: any) => {
    // Get the router object
    const router = useRouter();

    // Check if the user is logged in
    const isLoggedIn = checkUserLoggedIn(); // Implement your own function to check if the user is logged in

    // If the user is not logged in and we're on the client-side, redirect to login page
    useEffect(() => {
      if (!isLoggedIn && !router.pathname.includes('login')) {
        router.push('/login');
      }
    }, [isLoggedIn, router]);

    // If the user is not logged in and we're on the server-side, redirect to login page
    if (!isLoggedIn && typeof window === 'undefined') {
      router.push('/login');
      return null;
    }

    // If the user is logged in, render the wrapped component
    return <WrappedComponent {...props} />;
  };
};

// This is the component that requires authentication
function SecretPage() {
  return <h1>Secret Page</h1>;
}

// Wrap the SecretPage component with the withAuth HOC
export default withAuth(SecretPage);

```

#### SSR 인 경우

```javascript
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { checkUserLoggedIn } from '@/utils/auth';

type Props = {
  isAuthorized: boolean;
};

function SecretPage({ isAuthorized }: Props) {
  const router = useRouter();

  if (!isAuthorized) {
    // If the user is not authorized, redirect to the login page
    router.push('/login');
    return null;
  }

  return <h1>Secret Page</h1>;
}

export const getServerSideProps: GetServerSideProps<Props, ParsedUrlQuery> = async ({ req }) => {
  // Check if the user is logged in
  const isAuthorized = checkUserLoggedIn(req.headers.cookie);

  return {
    props: { isAuthorized },
  };
};

export default SecretPage;

```

#### CSR 인 경우

```javascript
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { checkUserLoggedIn } from '@/utils/auth';

type Props = {
  isAuthorized: boolean;
};

function SecretPage({ isAuthorized }: Props) {
  const router = useRouter();

  // If the user is not authorized and we're on the client-side, redirect to login page
  useEffect(() => {
    if (!isAuthorized && !router.pathname.includes('login')) {
      router.push('/login');
    }
  }, [isAuthorized, router]);

  return <h1>Secret Page</h1>;
}

export default withAuth(SecretPage);

```

