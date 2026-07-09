function Container({ children, className = '' }) {
  return (
    <div className={`av-container ${className}`}>
      {children}
    </div>
  );
}

export default Container;
