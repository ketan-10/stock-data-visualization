# Stock data visualizer

- [🟢 Live](https://www.ketan.link/stock-data-visualization) [hosting and CI/CD for frontend with github-pages]
- [Backend](https://hosted-function.vercel.app/) (deployed using [vercel](https://vercel.com/))

## Very lightweight
-  Project has following 3 dependencies   
```json
"dependencies": {
    "@headlessui/vue": "^1.7.19",
    "lightweight-charts": "^4.1.3",
    "vue": "^3.4.21"
},
```
- As the name suggest [`@headlessui/vue`](https://headlessui.com/) is a headless ui library. 
- Headless libraries do not render anything visual on screen. That way we get pixel-perfect control, at the expense of writing your own components. <br>
- Whole [dist directory](https://github.com/ketan-10/stock-data-visualization/tree/gh-pages) including all assets is 280kb (without zipping)

## Tech stack.
**I am pretty happy with the tech stack I decided on. (I would have used vee-validate for form validation if I did it again)**
  1. Vuejs
  2. Typescript
  3. lightweight-charts
  4. Tailwind
  5. headlessui
  6. vite.js
  7. eslint and prettier
  8. Fastify and typescript for the backend.

## screenshots

| Dark Mode  | Light Mode | 
| ---------- | ----------- |
| ![image](https://github.com/ketan-10/stock-data-visualization/assets/35309821/79cb63a4-2ba5-4e90-be29-65c8e72dec31) | ![image](https://github.com/ketan-10/stock-data-visualization/assets/35309821/0ab2469f-d0d6-4090-a78c-5b1348239922) |


| Tablet View  | Mobile View |
| ---------- | ----------- |
| ![image](https://github.com/ketan-10/stock-data-visualization/assets/35309821/d2091be4-948b-4189-98f2-5dc2f68345e1) | ![image](https://github.com/ketan-10/stock-data-visualization/assets/35309821/3fca00ee-c813-4c1a-93b6-25b92adb0fdd) |


Equity.csv : `Security Code,Issuer Name,Security Id,ISIN No`
