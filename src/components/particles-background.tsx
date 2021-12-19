import Particles from "react-tsparticles";

const ParticlesBackground = () => (
  <Particles
    params={{
      particles: {
        color: { value: "#333333" },
        number: {
          value: 160,
          density: {
            enable: true,
            value_area: 1500,
          },
        },
        line_linked: {
          color: { value: "#333333" },
          distance: 200,
          enable: true,
          opacity: 0.5,
        },
        move: {
          enable: true,
          direction: "none",
          speed: 0.5,
        },
        size: {
          value: 1,
        },
      },
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "repulse",
          },
        },
      },
      retina_detect: true,
    }}
  />
);
export default ParticlesBackground;
