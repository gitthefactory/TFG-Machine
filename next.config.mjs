const nextConfig = {
   distDir: 'build', 
   typescript: {
       ignoreBuildErrors: true,
   },
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'factorygaming.s3.amazonaws.com',
        pathname: '/**',    
      },
    ],
  },
};

export default nextConfig;

