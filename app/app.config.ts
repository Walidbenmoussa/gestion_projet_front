export default defineAppConfig({
  ui: {
    marquee:{
      slots:{root:'bg-green-50 [--duration:45s] '
    }},
card: {
      slots: {
        body: "flex flex-col gap-4",
        root: "w-sm mx-auto shadow-2xl rounded-md  !bg-base-300  ",
        footer: "flex flex-col gap-4",
      },
    },
    formField: { slots: { error: "text-xs" } },
    toast: {
      slots: {
        description: "text-white",
      },
    },
    main: {
      base: " w-full bg-base-200 min-h-screen  ",
    },

    colors: {
      primary: "green",
      neutral: "slate",
    },
  },
});
