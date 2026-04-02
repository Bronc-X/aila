const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = [...walk(path.join(process.cwd(), 'app')), ...walk(path.join(process.cwd(), 'components'))];

const mappings = [
    // Pass 2: Remaining inline blacks
    [/bg="#000000"/g, 'bg="#FAF9F6"'],
    [/bg="#000"/g, 'bg="#FAF9F6"'],
    [/bg="linear-gradient\(135deg, #0A0A0A 0%, #000000 100%\)"/g, 'bg="linear-gradient(135deg, #FAF9F6 0%, #F3F1ED 100%)"'],
    
    // Inline style blacks
    [/rgba\(0,0,0,0\.85\)/g, 'rgba(255,255,255,0.92)'],
    [/rgba\(0,0,0,0\.8\)/g, 'rgba(255,255,255,0.88)'],
    [/rgba\(0,0,0,0\.9\)/g, 'rgba(255,255,255,0.9)'],
    [/rgba\(28,25,23,0\.8\)/g, 'rgba(255,255,255,0.88)'],
    
    // Inline border blacks in style objects
    [/1px solid #111/g, '1px solid #E5E1D8'],

    // Remaining bg hex inline
    [/\bbg-\[\#000\]\b/g, 'bg-white'],
    [/\bbg-\[\#050505\]\b/g, 'bg-white'],
    [/\bbg-\[\#0A0A0A\]\b/g, 'bg-[#F4F2EC]'],
    
    // Remaining hover dark states
    [/\bhover:bg-\[\#080808\]\b/g, 'hover:bg-[#F5F3EE]'],
    [/\bhover:bg-\[\#DDD\]\b/g, 'hover:bg-[#B45309]'],
    [/\bhover:bg-\[\#CCC\]\b/g, 'hover:bg-[#B45309]'],

    // Fix text colors on now-light backgrounds that used dark theme contrast
    // text-[#999] is too light on white bg - darken it
    [/\btext-\[\#999\]\b/g, 'text-[#6B6660]'],
    
    // Remaining text-[#222] (nearly invisible on white) -> proper dark
    [/\btext-\[\#222\]\b/g, 'text-[#2D2A26]'],
    
    // Fix remaining border remnants
    [/\bborder-\[\#111\]\b/g, 'border-[#E5E1D8]'],
    
    // Fix placeholder colors that are now invisible
    [/\bplaceholder-\[\#333\]\b/g, 'placeholder-[#A3A3A3]'],
    
    // Fix bg-white/90 etc (from prior script, might need adjusting)
    // These were from bg-black/90 -> bg-white/80, which creates a white overlay
    // That's actually fine for modals on light theme
    
    // Fix remaining rounded-2xl to rounded-xl (Jobsian -> Claude softer but still contained)
    [/\brounded-2xl\b/g, 'rounded-xl'],
];

let totalChanges = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;
    
    mappings.forEach(([regex, replacement]) => {
        newContent = newContent.replace(regex, replacement);
    });

    if (newContent !== content) {
        fs.writeFileSync(file, newContent);
        totalChanges++;
        console.log('Fixed:', path.relative(process.cwd(), file));
    }
});

console.log(`\nPass 2: Fixed ${totalChanges} files.`);
