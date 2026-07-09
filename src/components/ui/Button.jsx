function Button({ children, type = 'button', ...props }) {
  return (
    <button
      className="av-button-primary"
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
