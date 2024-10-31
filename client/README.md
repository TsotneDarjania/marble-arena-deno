# deno-solidjs-ssr-boilerplate

A boilerplate project template using Deno and SolidJS with EJS-based server-side rendering.

## Overview

This boilerplate is designed for building fast, reactive web applications with Deno as the backend framework and SolidJS for the front end. It includes EJS templating for server-side rendering, providing a straightforward, highly performant setup out of the box.

## Features

- **Deno Backend**: Powered by Deno, with built-in TypeScript support for a secure and fast runtime.
- **SolidJS**: Uses SolidJS to create reactive and declarative UIs.
- **Server-Side Rendering (SSR)**: Renders HTML on the server using an `index.ejs` template file.
- **Pre-configured Scripts**: Ready-to-use development, build, and preview scripts.

## Getting Started

### Prerequisites

- **Deno**: Install Deno by following the [Deno installation guide](https://deno.land/manual/getting_started/installation).

### Installation

Clone the repository and cache dependencies:

```bash
git clone https://github.com/yourusername/deno-solidjs-ssr-boilerplate.git
cd deno-solidjs-ssr-boilerplate
deno run --allow-net --allow-read main.tsdeno cache main.ts