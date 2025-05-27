import RLCPClient from "./RLCPClient.jsx";

export default class BronKerboschRLCP extends RLCPClient {
    parseGenerateResponse(xmlText) {
        try {
            const mainRegex = /^(?<status>\d+)[\s\S]+?content-length:(?<length>\d+)\n\n(?<xml><\?xml[\s\S]+<\/Response>)/i;
            const mainMatch = xmlText.match(mainRegex);
            if (!mainMatch?.groups) throw new Error('Invalid format');

            const { status, length, xml } = mainMatch.groups;
            const xmlParser = new DOMParser();
            const xmlDoc = xmlParser.parseFromString(xml, 'text/xml');

            const generatingResult = xmlDoc.querySelector('GeneratingResult');
            this.text = Array.from(generatingResult.querySelector('Text').childNodes)[1]
            this.code = Array.from(generatingResult.querySelector('Code').childNodes)[1]
            this.instructions = Array.from(generatingResult.querySelector('Instructions').childNodes)[1]

            const codeComment = Array.from(generatingResult.querySelector('Code').childNodes)
                .find(node => node.nodeType === Node.COMMENT_NODE)?.nodeValue.trim();

            if (!codeComment) throw new Error('No code comment found');

            const [nodes, edges] = codeComment.split('~~~').map(part => part.split(','));
            console.log(edges)

            return {
                status: parseInt(status, 10),
                contentLength: parseInt(length, 10),
                graph: {
                    nodes,
                    edges: edges.map(edge => {
                        const [source, target] = edge.split('-');
                        return { source, target };
                    })
                }
            };
        } catch (error) {
            throw new Error(`XML parsing failed: ${error.message}`);
        }
    }
}