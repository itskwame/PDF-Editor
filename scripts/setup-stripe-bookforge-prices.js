require("dotenv").config({ path: ".env.local", quiet: true })

const Stripe = require('stripe')

const PACKAGES = [
  {
    name: 'BookForge 10-Page Book - No Images',
    amount: 1900,
    envVar: 'STRIPE_PRICE_10_NO_IMAGES',
    lookupKey: 'bookforge_10_no_images',
    pages: '10',
    withImages: false,
  },
  {
    name: 'BookForge 10-Page Book - With Images',
    amount: 3900,
    envVar: 'STRIPE_PRICE_10_WITH_IMAGES',
    lookupKey: 'bookforge_10_with_images',
    pages: '10',
    withImages: true,
  },
  {
    name: 'BookForge 50-Page Book - No Images',
    amount: 4900,
    envVar: 'STRIPE_PRICE_50_NO_IMAGES',
    lookupKey: 'bookforge_50_no_images',
    pages: '50',
    withImages: false,
  },
  {
    name: 'BookForge 50-Page Book - With Images',
    amount: 9900,
    envVar: 'STRIPE_PRICE_50_WITH_IMAGES',
    lookupKey: 'bookforge_50_with_images',
    pages: '50',
    withImages: true,
  },
  {
    name: 'BookForge 100-Page Book - No Images',
    amount: 9900,
    envVar: 'STRIPE_PRICE_100_NO_IMAGES',
    lookupKey: 'bookforge_100_no_images',
    pages: '100',
    withImages: false,
  },
  {
    name: 'BookForge 100-Page Book - With Images',
    amount: 19900,
    envVar: 'STRIPE_PRICE_100_WITH_IMAGES',
    lookupKey: 'bookforge_100_with_images',
    pages: '100',
    withImages: true,
  },
  {
    name: 'BookForge 200-Page Book - No Images',
    amount: 19900,
    envVar: 'STRIPE_PRICE_200_NO_IMAGES',
    lookupKey: 'bookforge_200_no_images',
    pages: '200',
    withImages: false,
  },
  {
    name: 'BookForge 200-Page Book - With Images',
    amount: 39900,
    envVar: 'STRIPE_PRICE_200_WITH_IMAGES',
    lookupKey: 'bookforge_200_with_images',
    pages: '200',
    withImages: true,
  },
  {
    name: 'BookForge 300-Page Book - No Images',
    amount: 34900,
    envVar: 'STRIPE_PRICE_300_NO_IMAGES',
    lookupKey: 'bookforge_300_no_images',
    pages: '300',
    withImages: false,
  },
  {
    name: 'BookForge 300-Page Book - With Images',
    amount: 69900,
    envVar: 'STRIPE_PRICE_300_WITH_IMAGES',
    lookupKey: 'bookforge_300_with_images',
    pages: '300',
    withImages: true,
  },
  {
    name: 'BookForge 500-Page Book - No Images',
    amount: 69900,
    envVar: 'STRIPE_PRICE_500_NO_IMAGES',
    lookupKey: 'bookforge_500_no_images',
    pages: '500',
    withImages: false,
  },
  {
    name: 'BookForge 500-Page Book - With Images',
    amount: 129900,
    envVar: 'STRIPE_PRICE_500_WITH_IMAGES',
    lookupKey: 'bookforge_500_with_images',
    pages: '500',
    withImages: true,
  },
]

function metadataFor(packageConfig) {
  return {
    app: 'bookforge',
    pages: packageConfig.pages,
    with_images: packageConfig.withImages ? 'true' : 'false',
    package_type: 'book_package',
  }
}

async function findActivePrice(stripe, lookupKey) {
  const prices = await stripe.prices.list({
    active: true,
    lookup_keys: [lookupKey],
    limit: 1,
  })

  return prices.data[0] || null
}

async function createOneTimePrice(stripe, packageConfig) {
  const metadata = metadataFor(packageConfig)
  const product = await stripe.products.create({
    name: packageConfig.name,
    metadata,
  })

  return stripe.prices.create({
    active: true,
    currency: 'usd',
    lookup_key: packageConfig.lookupKey,
    metadata,
    product: product.id,
    unit_amount: packageConfig.amount,
  })
}

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY.')
    console.error('Set STRIPE_SECRET_KEY in your shell, then rerun npm run stripe:setup-prices.')
    process.exit(1)
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const envLines = []

  for (const packageConfig of PACKAGES) {
    const existingPrice = await findActivePrice(stripe, packageConfig.lookupKey)
    const price = existingPrice || (await createOneTimePrice(stripe, packageConfig))

    envLines.push(`${packageConfig.envVar}=${price.id}`)
  }

  console.log(envLines.join('\n'))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
