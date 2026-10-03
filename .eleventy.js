export default function (eleventyConfig){
    //dirs to copy
    eleventyConfig.addPassthroughCopy("src/script")
    eleventyConfig.addPassthroughCopy("src/fonts")

    //dirs
    return{
        dir:{
            input: "src",
            output: "public",
        },
        devServer: {
            host: "0.0.0.0",
            port: 8080
        },
    };
};