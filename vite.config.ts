import {readdirSync} from 'node:fs'
import react, {reactCompilerPreset} from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import {fileURLToPath, URL} from "node:url";
import {defineConfig} from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import Pages from 'vite-plugin-pages'

// https://vite.dev/config/
export default defineConfig(() => {
    const srcRoot = fileURLToPath(new URL('./src', import.meta.url))
    const srcTopLevelAliases = readdirSync(srcRoot, {withFileTypes: true})
        .filter((entry) => entry.isDirectory())
        .map((entry) => ({
            find: new RegExp(`^@${entry.name}(?=/|$)`),
            replacement: `${srcRoot}/${entry.name}`,
        }))

    return {
        plugins: [
            react(),
            babel({presets: [reactCompilerPreset()]}),
            Pages({
                resolver: 'react',
                dirs: 'src/pages'
            }),
            UnoCSS(),
            AutoImport({
                dts: 'auto-imports.d.ts',
                imports: [
                    'react',
                    'react-router-dom',
                    {
                        zustand: ['create'],
                        dayjs: [['default', 'dayjs']],
                        '@tanstack/react-query': [
                            'useQuery', 'useQueryClient'
                        ],
                        '@iconify/react': [
                            'Icon'
                        ],
                        '@bprogress/react': [
                            'useProgress'
                        ]
                    },
                    {
                        from: 'react',
                        imports: ['ReactNode'],
                        type: true
                    }
                ],
                dirs: [
                    'src/shared/**',
                    'src/entities/**',
                    'src/biz/**',
                    'src/widgets/**',
                ]
            }),
        ],
        resolve: {
            alias: [
                ...srcTopLevelAliases,
                {
                    find: /^@(?=\/)/,
                    replacement: srcRoot,
                },
            ],
        },
    }
})
