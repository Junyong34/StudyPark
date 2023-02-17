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

