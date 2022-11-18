const prompt = require("prompt-sync")()
const ora = require("ora")
const { exec } = require("./helpers/exec")

// Read the android and iOS candidate tags
var androidTag = prompt("What's the android release tag? (e.g. android-8.0.4-516): ").trim()
var iOSTag = prompt("What's the iOS release tag? (e.g. ios-8.0.4-2022.08.04.12): ").trim()

/**
 * @param {string} tag
 */
function addSubmissionTag(tag) {
  const platform = tag.includes("android") ? "android" : "ios"
  const spinner = ora(`adding submission tag to ${platform} ...`).start()

  try {
    exec(`git checkout ${tag}`)
    exec(`git tag ${tag}-submission`)
    exec(`git push origin ${tag}-submission`)
    spinner.succeed()
  } catch (e) {
    spinner.fail()
    console.error(e)
  } finally {
    exec(`git reset --hard `)
    exec(`git checkout main`)
  }
}

// Add the submission tag to the android release
addSubmissionTag(androidTag)
// Add the submission tag to the iOS release
addSubmissionTag(iOSTag)
