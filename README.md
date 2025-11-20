# TENET ID Card Generator

A proof-of-concept tool for generating customized ID cards from SVG templates with dynamic content replacement. (This is a very low effort codebase please don't judge)

## Overview

This project generates multiple ID cards by reading participant data from a JSON file and replacing placeholders in SVG templates. Each generated SVG contains relative links to images (QR codes, photos) rather than embedded base64 data.

**Important**: Due to the use of relative file paths (e.g., `xlink:href="../qrcodes/H001.svg"`), the generated SVGs cannot be shared directly. They must be converted to PNG or other raster formats before distribution.

## How It Works

1. **Template System**: SVG templates are stored in the `backgrounds/` directory with naming convention `{teamSize}th{memberPosition}.svg` (e.g., `3th1.svg` for first member of a 3-person team)

2. **Placeholders**: Templates contain text placeholders that get replaced:

   - `{QRCODE_ID}` → Participant's Member ID (used in QR code links)
   - `JOHN` → First name (uppercase)
   - `DOE` → Last name (uppercase, max 6 chars)
   - `TEAM NAME` → Team name (uppercase)

3. **Image References**: Templates use `xlink:href` with relative paths like:

   ```xml
   <image xlink:href="../qrcodes/{QRCODE_ID}.svg" />
   ```

4. **Output**: Generated SVG files are saved to `output/` directory, named using Member ID (e.g., `H001.svg`)

## Prerequisites

- Node.js
- TypeScript
- Sharp (for image processing)

## Installation

```bash
npm install
```

## Usage

1. **Prepare your data**: Create/update `participants.json` with your participant data:

   ```json
   [
   	{
   		"Team ID": 1,
   		"Team Name": "Team Alpha",
   		"Member ID": "H001",
   		"Name": "John Doe",
   		"Email": "john@example.com",
   		"Phone": "1234567890",
   		"Member Count": 3
   	}
   ]
   ```

2. **Prepare templates**: Place SVG templates in `backgrounds/` directory following the naming pattern

3. **Prepare assets**: Ensure QR codes and other images are in their respective directories (`qrcodes/`, etc.)

4. **Generate ID cards**:

   ```bash
   npm run generate
   ```

   Or run steps separately:

   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
.
├── backgrounds/          # SVG templates
├── qrcodes/             # QR code images
├── output/              # Generated ID cards
├── participants.json    # Input data
└── src/
    └── generate-ids.ts  # Main generation script
```

## Limitations

- Generated SVGs use relative paths and cannot be directly shared
- Last names longer than 6 characters are truncated
- Requires specific template naming convention
- Template must exist for each team size/position combination

## Converting to Shareable Format

To share the generated IDs, convert them to PNG or other raster formats:

```bash
# Using ImageMagick
convert input.svg output.png

# Using Inkscape
inkscape input.svg --export-filename=output.png
```

Or use the Sharp library programmatically to batch convert the SVGs.

## License

MIT
