import {Blocks} from "@/components/factories/block/Blocks";

export class BlockFactory {
    availableBlocks = null;
    constructor() {
        this.availableBlocks = Blocks.getBlocks();
    }
    renderBlock(block) {
        if (!this.availableBlocks.hasOwnProperty(block)) {
            return null;
        }
        return this.availableBlocks[block];
    }

}
