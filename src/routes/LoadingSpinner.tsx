export const LoadingSpinner = ({
  size = "5rem",
  message = "Loading...",
}) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
        }}
      >
        {/* Outer ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "5px solid #e2e8f0",
            borderTopColor: "#6366f1",
            borderRightColor: "#3b82f6",
            animation: "spin 1s linear infinite",
          }}
        />

        {/* Inner ring */}
        <div
          style={{
            position: "absolute",
            inset: "15%",
            borderRadius: "50%",
            border: "3px solid #e2e8f0",
            borderBottomColor: "#06b6d4",
            animation: "spinReverse 0.7s linear infinite",
          }}
        />

        {/* Center */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "20%",
            height: "20%",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: "#6366f1",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.6)",
            animation: "pulse 1s ease-in-out infinite",
          }}
        />
      </div>

      {message && (
        <div
          style={{
            marginTop: "1.5rem",
            fontSize: "1rem",
            fontWeight: 600,
            color: "#475569",
          }}
        >
          {message}
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes spinReverse {
            from {
              transform: rotate(360deg);
            }
            to {
              transform: rotate(0deg);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 0.7;
            }

            50% {
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};