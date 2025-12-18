const Card = ({
    children,
    className = '',
    hover = false,
    padding = true,
}) => {
    return (
        <div
            className={`bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden ${hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''
                } ${className}`}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ children, className = '' }) => {
    return (
        <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
            {children}
        </div>
    );
};

const CardBody = ({ children, className = '', padding = true }) => {
    return (
        <div className={`${padding ? 'p-6' : ''} ${className}`}>
            {children}
        </div>
    );
};

const CardFooter = ({ children, className = '' }) => {
    return (
        <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${className}`}>
            {children}
        </div>
    );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
