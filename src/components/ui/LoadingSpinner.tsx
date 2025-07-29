const LoadingSpinner = () => {
  return (
    <div
      style={{
        width: "14px",
        height: "14px",
        border: "2px solid #fff",
        borderTop: "2px solid transparent",
        borderRadius: "50%",
        animation: "spin 0.6s linear infinite",
      }}
    />
  );
};

export default LoadingSpinner;
