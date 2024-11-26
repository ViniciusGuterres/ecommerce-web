import '../index.css';

// Components
import Header from './Header.jsx';

/**
 * @function Layout - Will render The header fixed element and the children component that depends of the current url
 */
function Layout({ children }) {
    return (
        <div>
            <Header />
            {children}
        </div>
    );
}

export default Layout;