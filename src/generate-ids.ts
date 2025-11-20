import sharp from "sharp";
import fs from "fs";
import path from "path";

interface Participant {
  "Team ID": number;
  "Team Name": "string";
  "Member ID": string;
  "Name": string;
  "Email": string;
  "Phone": string;
  "Member Count": number;
}

const PROJECT_ROOT = path.resolve(__dirname, "..");
const TEMPLATES_DIR = path.join(PROJECT_ROOT, "backgrounds");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "output");
const DATA_FILE = path.join(PROJECT_ROOT, "participants.json");

async function generateIdCards(): Promise<void> {
  console.log("Starting ID card generation...");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
  const participants: Participant[] = JSON.parse(fileContent);

  const teams: Record<string, Participant[]> = participants.reduce(
    (acc, participant) => {
      const teamName = participant["Team Name"];
      acc[teamName] = acc[teamName] || [];
      acc[teamName].push(participant);
      return acc;
    },
    {} as Record<string, Participant[]>,
  );

  for (const teamName in teams) {
    const members = teams[teamName];
    const teamSize = members.length;

    console.log(`\nProcessing Team: "${teamName}" with ${teamSize} members.`);

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const memberIndex = i + 1;
      const templateFileName = `${teamSize}th${memberIndex}.svg`;
      const templatePath = path.join(TEMPLATES_DIR, templateFileName);

      if (!fs.existsSync(templatePath)) {
        console.warn(
          `⚠️ Warning: Template file not found at ${templatePath}. Skipping member "${
            member["Name"]
          }".`,
        );
        continue;
      }

      const svgContent = fs.readFileSync(templatePath, "utf-8");

      // --- MODIFIED: Split name into parts ---
      const fullName = member["Name"];
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = (nameParts[0] || "").toUpperCase();
      let lastName = nameParts.length > 1
        ? nameParts[nameParts.length - 1]
        : "";
      lastName = lastName.length > 6 ? "" : lastName;

      const modifiedSvg = svgContent
        .replace(/{QRCODE_ID}/g, member["Member ID"])
        .replace(/JOHN/g, firstName)
        .replace(/DOE/g, lastName)
        .replace(/TEAM NAME/g, member["Team Name"].toUpperCase());

      const outputFileName = `${member["Member ID"]}${
        firstName.length > 8 ? "fe" : ""
      }.svg`;
      const outputPath = path.join(OUTPUT_DIR, outputFileName);

      try {
        await fs.writeFileSync(outputPath, modifiedSvg);
        console.log(`✅ Successfully generated: ${outputFileName}`);
      } catch (error) {
        console.error(`❌ Failed to generate card for ${fullName}:`, error);
      }
    }
  }

  console.log("\n✨ ID card generation complete!");
}

generateIdCards();
