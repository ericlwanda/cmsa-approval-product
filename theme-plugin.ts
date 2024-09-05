import plugin from "tailwindcss/plugin";

export const themePlugin = plugin(
  function ({ addBase }) {
    addBase({
      ":root": {
        "--background": "234 17% 98%",
        "--foreground": "234 17% 20%",
        "--muted": "210 40% 96.1%",
        "--muted-foreground": "215.4 16.3% 46.9%",
        "--popover": "0 0% 100%",
        "--popover-foreground": "222.2 84% 4.9%",
        "--card": "0 0% 100%",
        "--card-foreground": "222.2 84% 4.9%",
        "--border": "214.3 31.8% 91.4%",
        "--input": "214.3 31.8% 91.4%",
        "--primary": "200 80% 72%", // Light blue
        "--primary-foreground": "200 100% 10%", // Darker text color for contrast
        "--secondary": "210 40% 96.1%",
        "--secondary-foreground": "222.2 47.4% 11.2%",
        "--accent": "210 40% 96.1%",
        "--accent-foreground": "222.2 47.4% 11.2%",
        "--destructive": "0 100% 50%",
        "--destructive-foreground": "210 40% 98%",
        "--ring": "200 100% 75%", // Light blue
        "--radius": ".5rem",
        "--navigation-height": "2.8rem",
      },
      ".dark": {
        "--background": "234 17% 12%",
        "--foreground": "234 17% 82%",
        "--muted": "234 17% 20%",
        "--muted-foreground": "234 17% 78%",
        "--popover": "234 17% 16%",
        "--popover-foreground": "234 17% 78%",
        "--card": "234 17% 16%",
        "--card-foreground": "234 17% 78%",
        "--border": "234 17% 20%",
        "--input": "234 17% 25%",
        "--primary": "200 100% 60%", // Adjusted light blue for dark mode
        "--primary-foreground": "200 100% 90%", // Light blue text color for dark mode
        "--secondary": "234 17% 18%",
        "--secondary-foreground": "234 17% 78%",
        "--accent": "234 17% 18%",
        "--accent-foreground": "200 100% 90%",
        "--destructive": "0 43% 43%",
        "--destructive-foreground": "234 17% 78%",
        "--ring": "234 17% 12%",
      },
    });

    addBase({
      " * ": {
        "@apply border-border": {},
      },
      body: {
        "@apply bg-background text-foreground": {},
      },
    });
  },
  {
    theme: {
      fontFamily: {
        sans: '"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu, Cantarell,"Open Sans","Helvetica Neue",sans-serif',
      },
      container: {
        center: true,
        padding: "2rem",

        screens: {
          DEFAULT: "1200px",
          "2xl": "1400px",
          xl: "1280px",
          lg: "1024px",
          md: "768px",
          sm: "640px",
        },
      },

      boxShadow: {
        primary: "rgb(80 63 205 / 50%) 0px 1px 40px",
      },

      extend: {
        spacing: {
          "navigation-height": "var(--navigation-height)",
        },

        transitionDelay: {
          0: "0ms",
        },
        keyframes: {
          "fade-in": {
            from: { opacity: "0", transform: "translateY(-10px)" },
            to: { opacity: "1", transform: "none" },
          },
          "image-rotate": {
            "0%": { transform: "rotateX(25deg)" },
            "25%": { transform: "rotateX(25deg) scale(0.9)" },
            "60%": { transform: "none" },
            "100%": { transform: "none" },
          },
          "image-glow": {
            "0%": {
              opacity: "0",
              "animation-timing-function": "cubic-bezier(0.74,0.25,0.76,1)",
            },
            "10%": {
              opacity: "1",
              "animation-timing-function": "cubic-bezier(0.12,0.01,0.08,0.99)",
            },
            "100%": {
              opacity: "0.2",
            },
          },
          "sketch-lines": {
            "0%": { "stroke-dashoffset": "1" },
            "50%": { "stroke-dashoffset": "0" },
            "99%": { "stroke-dashoffset": "0" },
            "100%": { visiblity: "hidden" },
          },
          "glow-line-horizontal": {
            "0%": { opacity: "0", transform: "translateX(0)" },
            "5%": { opacity: "1", transform: "translateX(0)" },
            "90%": { opacity: "1" },
            "100%": { opacity: "0", transform: "translateX(min(60vw, 45rem))" },
          },
          "glow-line-vertical": {
            "0%": { opacity: "0", transform: "translateY(0)" },
            "5%": { opacity: "1", transform: "translateY(0)" },
            "90%": { opacity: "1" },
            "100%": { opacity: "0", transform: "translateY(min(21vw, 45rem))" },
          },
          zap: {
            "0%, 9%, 11%, 100% ": {
              fill: "transparent",
            },
            "10%": {
              fill: "white",
            },
          },
          bounce: {
            "50%": {
              transform: "scale(0.98)",
            },
          },
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
        },

        animation: {
          "fade-in": "fade-in 1000ms var(--animation-delay, 0ms) ease forwards",
          "image-rotate": "image-rotate 1400ms ease forwards",
          "image-glow": "image-glow 4100ms 600ms ease-out forwards",
          "sketch-lines": "sketch-lines 1200ms ease-out forwards",
          "glow-line-horizontal":
            "glow-line-horizontal var(--animation-duration) ease-in forwards",
          "glow-line-vertical":
            "glow-line-vertical var(--animation-duration) ease-in forwards",
          zap: "zap 2250ms calc(var(--index) * 20ms) linear infinite",
          bounce: "240ms ease 0s 1 running bounce",
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },

        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
      },
    },
  }
);
