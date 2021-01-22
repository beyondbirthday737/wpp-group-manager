const puppeteer = require('puppeteer')
const QRcodeGen = require('qrcode-terminal')

module.exports = (toolbox) => {
    const { print: { success, error } } = toolbox;

    async function run(path, group){
        const contactsNumbersJson = require(`${path}`)
        const contactsNumbers = [...contactsNumbersJson.contactsNumbers]
        
        const browser = await puppeteer.launch({executablePath: '/usr/bin/google-chrome', headless: true})
        const page = await browser.newPage()
    
        await page.setUserAgent(
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
        )
    
        await page.goto("https://web.whatsapp.com/")
        await delay(5000)
        
        success('waiting for a QR code...')

        await getQRCode()
        
        await page.waitForSelector("._1Ra05")
        await delay(5000)
        
        const groupName = group
        success(`searching for a ${groupName}...`)
        await page.click(`span[title='${groupName}']`)
        await page.waitForSelector('._3Wrfs')
        await delay(3000)
        
        await page.waitForSelector('._1UuMR')
        await page.click('._1vGIp')
        await delay(3000)
        
        await page.waitForSelector('._2XSjg')
        await page.click('._1C6Zl')
        
        success("adding contacts...")
        for(let i = 0; i < contactsNumbers.length; i++){ 
            await page.type('._1awRl', contactsNumbers[i])
            await delay(3000)
            await page.keyboard.press('Enter')
            await delay(3000)
        }
        
        await page.click('._3Git-')
        await delay(3000)
        await page.click('.gMRg5')
        
        await delay(60000)
        await browser.close()
        
        success("Done...")

        async function getQRCode(){
            let scanme = "img[alt='Scan me!'], canvas"
            await page.waitForSelector(scanme)
            let imageData = await page.evaluate(`document.querySelector("${scanme}").parentElement.getAttribute("data-ref")`)
            QRcodeGen.generate(imageData, {small: true}) 
        }

    function delay(time) {
        return new Promise(resolve => {
            setTimeout(resolve, time);
        });
    }   
    }

    toolbox.run = run
}

