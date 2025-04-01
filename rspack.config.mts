import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { type Configuration, HtmlRspackPlugin, type Plugin, type RuleSetRule, type Target } from '@rspack/core'

type Name = 'main' | 'preload' | 'renderer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isServe = process.argv.includes('serve')
const isWatch = process.argv.includes('--watch') || process.argv.includes('-w')
const env = process.env.NODE_ENV as 'development' | 'production'

function createConfiguration(name: Name): Configuration | null {
  if (name == 'renderer' && !isServe && env == 'development') {
    return null
  }

  return {
    name: name,
    entry: {
      main: `./src/${name}/${name}.${name == 'renderer' ? 'tsx' : 'ts'}`,
    },
    output: {
      path: path.resolve(__dirname, `dist/${name}`),
      filename: `${name}.js`,
    },
    devtool: 'eval-cheap-module-source-map',
    devServer: isServe
      ? {
          port: 5173,
          hot: false,
        }
      : void 0,
    mode: env ?? 'development',
    module: {
      rules: getRules(name),
    },
    watch: isWatch,
    resolve: {
      alias: {
        '@mui/styled-engine': '@mui/styled-engine-sc',
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: getPlugins(name),
    target: getTarget(name),
    externalsPresets: {
      electronMain: name == 'main',
      electronPreload: name == 'preload',
      electronRenderer: name == 'renderer',
    },
    experiments: {
      css: true,
    }
  }
}

function getRules(name: Name): RuleSetRule[] {
  const rules: RuleSetRule[] = []

  if (name == 'renderer') {
    rules.push({
      test: /\.jsx$/,
      use: {
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'ecmascript',
              jsx: true,
            },
          },
        },
      },
      type: 'javascript/auto',
    })
  }

  rules.push({
    test: /\.tsx?$/,
    exclude: [/node_modules/],
    loader: 'builtin:swc-loader',
    options: {
      jsc: {
        experimental: {
          keepImportAttributes: true,
        },
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
      },
    },
    type: 'javascript/auto',
  })

  rules.push({
    test: /\.css$/,
    use: [
      {
        loader: 'builtin:lightningcss-loader',
      },
    ],
  })

  rules.push({
    test: /\.png$/,
    type: 'asset/resource',
  })

  return rules
}

function getPlugins(name: Name): Plugin[] {
  const plugins: Plugin[] = []

  if (name == 'renderer') {
    plugins.push(
      new HtmlRspackPlugin({
        template: `./src/${name}/index.html`,
        filename: 'index.html',
      }),
    )
  }

  return plugins
}

function getTarget(name: Name): Target {
  if (name == 'renderer') {
    return 'web'
  }
  if (name == 'main') {
    return 'electron-main'
  }
  if (name == 'preload') {
    return 'electron-preload'
  }
  throw new Error(`Unknown target for ${name}`)
}

export default [createConfiguration('main'), createConfiguration('preload'), createConfiguration('renderer')].filter(
  (x) => x != null,
)
