import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC_DIR = path.join(
  process.cwd(),
  "public/images/stitch_myfinanzguru_visual_identity_assets"
);
const OUT_DIR = path.join(process.cwd(), "public/images");

// Mapping: output flat filename -> source asset folder name.
// Chosen by matching source dimensions to the required aspect ratio, then by
// content description to the closest semantic fit. See chat for full rationale.
const MAPPING = {
  "home-hero.png": "confident_young_professional_couple_reviewing_finances_together_on_a_laptop_at_1",
  "home-step-1-understand.png": "close_up_of_hands_organizing_documents_calculator_and_insurance_folders_on_a",
  "home-step-2-keep.png": "financial_advisor_and_client_in_a_friendly_online_video_consultation_laptop",
  "home-step-3-grow.png": "young_family_looking_at_a_growth_chart_on_a_tablet_small_potted_plant_beside",

  "service-private-credits.png": "elegant_flat_lay_of_a_house_key_pen_and_loan_documents_on_a_white_linen_surface",
  "service-child-future.png": "parent_and_child_putting_a_coin_into_a_clear_glass_jar_soft_daylight_through_a",
  "service-health-insurance.png": "stethoscope_resting_on_a_white_folder_beside_a_navy_blue_pen_on_a_minimal_desk",
  "service-real-estate.png": "modern_german_apartment_building_facade_under_a_clear_blue_sky_clean",
  "service-gold-silver.png": "stack_of_gold_bars_and_silver_coins_on_a_cool_slate_gray_surface_with_soft",
  "service-finance-prime.png": "overhead_view_of_a_perfectly_organized_desk_with_financial_charts_smartphone",
  "service-tax-retirement.png": "hourglass_with_white_sand_beside_a_neat_document_stack_and_reading_glasses_cool",
  "service-insurance-protection.png": "navy_blue_umbrella_sheltering_a_small_white_model_house_and_family_figurines_on",
  "service-fund-etf.png": "minimal_3d_bar_chart_rising_in_glossy_blue_gradient_tones_with_a_small_green",

  "tool-finance-check.png": "minimal_3d_icon_illustration_of_a_clipboard_with_checkmarks_glossy_blue",
  "tool-real-estate.png": "minimal_3d_icon_illustration_of_a_small_house_with_a_percentage_symbol_floating",
  "tool-health-insurance.png": "minimal_3d_icon_illustration_of_a_shield_with_a_medical_cross_glossy_blue",
  "tool-investment.png": "minimal_3d_icon_illustration_of_a_rising_line_chart_with_three_coins_at_its",
  "tool-brutto-netto.png": "minimal_3d_icon_illustration_of_a_wallet_with_a_calculator_glossy_blue_gradient",

  "guide-inflation.png": "a_single_euro_coin_melting_slightly_like_ice_on_a_white_surface_conceptual_art",
  "guide-gkv-pkv.png": "two_elegant_doors_side_by_side_one_deep_navy_blue_and_one_light_silver_blue",
  "guide-etf.png": "small_green_sprout_growing_from_a_stack_of_silver_coins_on_a_light_blue",

  "about-team.png": "diverse_team_of_four_professional_financial_consultants_standing_in_a_bright",
  "webinar-hero.png": "laptop_on_a_tidy_desk_in_the_evening_showing_a_blurred_video_presentation_cool",
  "book-meeting.png": "two_coffee_cups_on_a_light_table_facing_each_other_with_an_open_notebook",
};

const UNUSED = [
  "confident_young_professional_couple_reviewing_finances_together_on_a_laptop_at_2",
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const blurMap = {};

  for (const [outName, srcFolder] of Object.entries(MAPPING)) {
    const srcPath = path.join(SRC_DIR, srcFolder, "screen.png");
    const outPath = path.join(OUT_DIR, outName);

    if (!fs.existsSync(srcPath)) {
      console.error(`✗ MISSING SOURCE for ${outName}: ${srcPath}`);
      continue;
    }

    fs.copyFileSync(srcPath, outPath);

    const blurBuffer = await sharp(srcPath)
      .resize(16, 16, { fit: "inside" })
      .blur()
      .webp({ quality: 40 })
      .toBuffer();
    blurMap[outName] = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

    const { size } = fs.statSync(outPath);
    console.log(`✓ ${outName}  (${(size / 1024).toFixed(0)}KB)  <- ${srcFolder}`);
  }

  fs.writeFileSync(
    path.join(process.cwd(), "src/lib/image-blur-map.json"),
    JSON.stringify(blurMap, null, 2)
  );
  console.log(`\nWrote blur placeholder map to src/lib/image-blur-map.json`);
  console.log(`\nUnused source assets (${UNUSED.length}):`);
  UNUSED.forEach((u) => console.log(`  - ${u}`));
}

main();
