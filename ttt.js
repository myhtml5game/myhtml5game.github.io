var wnd = document.getElementById("main");
var ctx = wnd.getContext('2d');

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var fs;
if (wnd.width < wnd.height) {
    fs = (wnd.height/5 < wnd.width/3 ? wnd.height/5*3 : wnd.width) * 0.9;
} else {
    fs = (wnd.width/5 < wnd.height/3 ? wnd.width/5*3 : wnd.height) * 0.9;
}
var cs = fs * 0.96 / 3;
var ss = fs * 0.02;
var fx1 = (wnd.width - fs) / 2;
var fy1 = (wnd.height - fs) / 2;
var fx2 = fx1 + fs;
var fy2 = fy1 + fs;
var clrx = "#ff0000";
var clro = "#0000ff";
var ailvl = 1;
var aimin = 0;
var aimax = 2;

var cc = [[],[],[]];
for (x = 0; x < 3; x++)
{
    for (y = 0; y < 3; y++)
    {
        cc[x][y] =
        {
            x1: fx1+(cs+ss)*x,
            y1: fy1+(cs+ss)*y,
            x2: fx1+(cs+ss)*x+cs,
            y2: fy1+(cs+ss)*y+cs,
            st: 0
        };
    }
}

var bc = [
    { x: wnd.width < wnd.height ? cc[1][2].x1 : cc[2][1].x2,
      y: wnd.width < wnd.height ? cc[1][2].y2 : cc[2][1].y1 },
    { x: wnd.width < wnd.height ? cc[0][0].x1 : cc[0][0].x1-cs,
      y: wnd.width < wnd.height ? cc[0][0].y1-cs : cc[0][0].y1 },
    { x: wnd.width < wnd.height ? cc[2][0].x1 : cc[0][2].x1-cs,
      y: wnd.width < wnd.height ? cc[2][0].y1-cs : cc[0][2].y1 }
];

ctx.lineWidth = ss;
ctx.strokeStyle = '#009900';
ctx.fillStyle = '#66ff66';
roundRect(bc[0].x+ss, bc[0].y+ss, cs-ss*2, cs-ss*2, ss*2, true);
ctx.lineWidth = ss*2;
ctx.beginPath();
ctx.arc(bc[0].x+cs/2, bc[0].y+cs/2, cs/2-ss*4, 0.125*Math.PI, 1.75*Math.PI);
ctx.moveTo(bc[0].x+cs-ss*5, bc[0].y+cs/2-ss);
ctx.lineTo(bc[0].x+cs-ss*4, bc[0].y+cs/2-ss);
ctx.lineTo(bc[0].x+cs-ss*4, bc[0].y+cs/2-ss*2);
ctx.closePath();
ctx.stroke();
ctx.lineWidth = ss;
ctx.strokeStyle = '#990000';
ctx.fillStyle = '#ff6666';
roundRect(bc[1].x+ss, bc[1].y+ss, cs-ss*2, cs-ss*2, ss*2, true);
ctx.lineWidth = ss*2;
ctx.beginPath();
ctx.moveTo(bc[1].x+ss*4, bc[1].y+cs/2);
ctx.lineTo(bc[1].x+cs-ss*4, bc[1].y+cs/2);
ctx.moveTo(bc[1].x+cs/2, bc[1].y+ss*4);
ctx.lineTo(bc[1].x+cs/2, bc[1].y+cs-ss*4);
ctx.stroke();
ctx.lineWidth = ss;
var aix = wnd.width < wnd.height ? cc[1][0].x1 : cc[0][1].x1-cs;
var aiy = wnd.width < wnd.height ? cc[1][0].y1-cs : cc[0][1].y1;
ctx.lineWidth = ss;
ctx.strokeStyle = '#999999';
roundRect(aix+ss*2, aiy+ss, cs-ss*4, cs/2+ss*2, ss*2);
ctx.strokeRect(aix+cs/2-ss*2, aiy+cs/2+ss*3, ss*4, ss*2);
ctx.strokeRect(aix+ss*4, aiy+cs/2+ss*5, cs-ss*8, ss*2);
ctx.strokeStyle = '#0000ff';
ctx.fillStyle = '#6666ff';
roundRect(bc[2].x+ss, bc[2].y+ss, cs-ss*2, cs-ss*2, ss*2, true);
ctx.lineWidth = ss*2;
ctx.beginPath();
ctx.moveTo(bc[2].x+ss*4, bc[2].y+cs/2);
ctx.lineTo(bc[2].x+cs-ss*4, bc[2].y+cs/2);
ctx.stroke();
ctx.lineWidth = ss;

draw_grid();
set_ai(ailvl);

//
// ---------------------------------------------------------------------------
function ai_turn()
{
    function put(cell) {
        cell.st = 2;
        ctx.beginPath();
        ctx.arc(cell.x1+cs/2, cell.y1+cs/2, cs/2-ss, 0, 2*Math.PI);
        ctx.strokeStyle = clro;
        ctx.stroke();
        ctx.closePath();
    }

    if (ailvl == 2) {
        function minimax(pos, turn, depth) {
            var over = false;
            var winr = 0;

                 if ((pos[0] === pos[1]) && (pos[1] === pos[2]) && (pos[2] > 0)) { winr = pos[2]; over = true; }
            else if ((pos[3] === pos[4]) && (pos[4] === pos[5]) && (pos[5] > 0)) { winr = pos[5]; over = true; }
            else if ((pos[6] === pos[7]) && (pos[7] === pos[8]) && (pos[8] > 0)) { winr = pos[8]; over = true; }
            else if ((pos[0] === pos[3]) && (pos[3] === pos[6]) && (pos[6] > 0)) { winr = pos[6]; over = true; }
            else if ((pos[1] === pos[4]) && (pos[4] === pos[7]) && (pos[7] > 0)) { winr = pos[7]; over = true; }
            else if ((pos[2] === pos[5]) && (pos[5] === pos[8]) && (pos[8] > 0)) { winr = pos[8]; over = true; }
            else if ((pos[0] === pos[4]) && (pos[4] === pos[8]) && (pos[8] > 0)) { winr = pos[8]; over = true; }
            else if ((pos[6] === pos[4]) && (pos[4] === pos[2]) && (pos[2] > 0)) { winr = pos[2]; over = true; }
            else {
                var board_full = true;
                for (var i = 9; i--;) {
                    if (pos[i] === 0) {
                        board_full = false;
                        break;
                    }
                }
                if (board_full) over = true;
            }
            if (over) {
                switch (winr) {
                     case 1: return 10 - depth;
                     case 2: return depth - 10;
                    default: return depth > 0 ? 0 : 10;
                }
            }

            var sc = [];
            var nd = depth + 1;
            var nt = turn === 1 ? 2 : 1;
            for (var i = 9; i--;) {
                if (pos[i] === 0) {
                    pos[i] = nt;
                    sc.push([i, minimax(pos, nt, nd)]);
                    pos[i] = 0;
                }
            }

            var mb = 0;
            var mi, mv, v;
            if (turn === 2) {
                mv = -11;
                for (var i = sc.length; i--;) {
                    v = sc[i];
                    if (v[1] > mv) {
                        mi = v[0];
                        mv = v[1];
                    }
                    mb += v[1] * 0.01;
                }
            } else {
                mv = 11;
                for (var i = sc.length; i--;) {
                    v = sc[i];
                    if (v[1] < mv) {
                        mi = v[0];
                        mv = v[1];
                    }
                    mb += v[1] * 0.01;
                }
            }
            return depth === 0 ? mi : mv + mb;
        }

        var p = [];
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                p.push(cc[x][y].st);
            }
        }
        console.time('foo'); // FIXME
        var choice = minimax(p, 1, 0);
        console.timeEnd('foo'); // FIXME
        if (choice < 10) put(cc[choice%3][Math.floor(choice/3)]);
        return;
    }

    if (ailvl == 1) {
        var s = [
            [cc[0][0], cc[1][0], cc[2][0]],
            [cc[0][1], cc[1][1], cc[2][1]],
            [cc[0][2], cc[1][2], cc[2][2]],
            [cc[0][0], cc[0][1], cc[0][2]],
            [cc[1][0], cc[1][1], cc[1][2]],
            [cc[2][0], cc[2][1], cc[2][2]],
            [cc[0][0], cc[1][1], cc[2][2]],
            [cc[0][2], cc[1][1], cc[2][0]]
        ];
        var mf = null;
        s.forEach(function(l) {
            var c2 = 0;
            var cx = null;
            l.forEach(function(c) {
                if (c.st === 2) c2++;
                else if (c.st === 0) cx = c;
            });
            if ((c2 === 2) && (cx !== null)) mf = cx;
        });
        if (mf === null) {
            s.forEach(function(l) {
                var c1 = 0;
                var cx = null;
                l.forEach(function(c) {
                    if (c.st === 1) c1++;
                    else if (c.st === 0) cx = c;
                });
                if ((c1 === 2) && (cx !== null)) mf = cx;
            });
        }
        if (mf !== null) {
            put(mf);
            return;
        }
    }

    var f = [];
    for (x = 0; x < 3; x++) {
        for (y = 0; y < 3; y++) {
            if (cc[x][y].st == 0) f.push(cc[x][y]);
        }
    }
    if (f.length > 0) put(f[Math.floor(Math.random() * f.length)]);
}

//
// ---------------------------------------------------------------------------
function draw_grid()
{
    ctx.fillStyle='#ffffff';
    ctx.fillRect(cc[0][0].x1-ss/2, cc[0][0].y1-ss/2, fs+ss, fs+ss);
    ctx.fillStyle='#000000';
    ctx.fillRect(cc[0][0].x2, cc[0][0].y1, ss, fs);
    ctx.fillRect(cc[1][0].x2, cc[1][0].y1, ss, fs);
    ctx.fillRect(cc[0][0].x1, cc[0][0].y2, fs, ss);
    ctx.fillRect(cc[0][1].x1, cc[0][1].y2, fs, ss);
}

//
// ---------------------------------------------------------------------------
function is_game_over()
{
    function strike(x1, y1, x2, y2) {
        game_over = true;
        ctx.lineCap = 'butt';
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    if (!game_over) {
        for (i = 0; i < 3; i++) {
            if ((cc[0][i].st == cc[1][i].st) && (cc[1][i].st == cc[2][i].st)) {
                if (cc[0][i].st > 0) {
                    strike(cc[0][i].x1, cc[0][i].y1+cs/2
                          ,cc[2][i].x2, cc[2][i].y1+cs/2);
                }
            }
            if ((cc[i][0].st == cc[i][1].st) && (cc[i][1].st == cc[i][2].st)) {
                if (cc[i][0].st > 0) {
                    strike(cc[i][0].x1+cs/2, cc[i][0].y1
                          ,cc[i][2].x1+cs/2, cc[i][2].y2);
                }
            }
        }
        if ((cc[0][0].st == cc[1][1].st) && (cc[1][1].st == cc[2][2].st)) {
            if (cc[0][0].st > 0) {
                strike(cc[0][0].x1, cc[0][0].y1, cc[2][2].x2, cc[2][2].y2);
            }
        }
        if ((cc[0][2].st == cc[1][1].st) && (cc[1][1].st == cc[2][0].st)) {
            if (cc[0][2].st > 0) {
                strike(cc[0][2].x1, cc[0][2].y2, cc[2][0].x2, cc[2][0].y1);
            }
        }
    }
    return game_over;
}

//
// ---------------------------------------------------------------------------
function handle_click(event)
{
    var x = event.clientX - ctx.canvas.getBoundingClientRect().left;
    var y = event.clientY - ctx.canvas.getBoundingClientRect().top;
    if ((x >= fx1) && (x <= fx2) && (y >= fy1) && (y <= fy2))
    {
        if (!game_over)
        {
            for (i = 0; i < 3; i++)
            {
                if (x < cc[i][0].x1) break;
                if (x > cc[i][0].x2) continue;
                for (j = 0; j < 3; j++)
                {
                    if (y < cc[0][j].y1) break;
                    if (y > cc[0][j].y2) continue;
                    if (cc[i][j].st == 0)
                    {
                        cc[i][j].st = 1;
                        ctx.beginPath();
                        ctx.moveTo(cc[i][j].x1+ss, cc[i][j].y1+ss);
                        ctx.lineTo(cc[i][j].x2-ss, cc[i][j].y2-ss);
                        ctx.moveTo(cc[i][j].x1+ss, cc[i][j].y2-ss);
                        ctx.lineTo(cc[i][j].x2-ss, cc[i][j].y1+ss);
                        ctx.strokeStyle = clrx;
                        ctx.lineWidth = ss;
                        ctx.lineCap = 'round';
                        ctx.stroke();
                        ctx.closePath();
                        if (is_game_over()) return;
                        ai_turn();
                        if (is_game_over()) return;
                    }
                }
            }
        }
    } else {
        bc.forEach(function(v, i) {
            if ((x >= v.x) && (x <= v.x+cs)) {
                if ((y >= v.y) && (y <= v.y+cs)) {
                    switch (i) {
                        case 0: reset(); break;
                        case 1: set_ai(ailvl+1); break;
                        case 2: set_ai(ailvl-1); break;
                    }
                }
            }
        });
    }
}

//
// ---------------------------------------------------------------------------
function reset()
{
    draw_grid();
    game_over = false;
    for (x = 0; x < 3; x++) {
        for (y = 0; y < 3; y++) {
            cc[x][y].st = 0;
        }
    }
}

//
// ---------------------------------------------------------------------------
function roundRect(x, y, width, height, radius, fill, stroke)
{
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

//
// ---------------------------------------------------------------------------
function set_ai(lvl)
{
    if ((lvl >= aimin) && (lvl <= aimax)) {
        ailvl = lvl;
        switch (ailvl) {
            case aimin: ctx.fillStyle = '#9999ff'; break;
            case aimax: ctx.fillStyle = '#ff9999'; break;
               default: ctx.fillStyle = '#ffff99';
        }
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = ss/2;
        roundRect(aix+ss*3, aiy+ss*2, cs-ss*6, cs/2, ss, true);
        switch (ailvl) {
            case aimin:
                ctx.strokeStyle = '#6666ff';
                ctx.beginPath();
                ctx.arc(aix+cs/2-ss*1.5, aiy+ss*4.5, ss*1.5, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fillStyle = '#ccccff';
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(aix+cs/2+ss*1.5, aiy+ss*4.5, ss*1.5, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(aix+cs/2-ss*2, aiy+ss*5, ss/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fillStyle = '#6666ff';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(aix+cs/2+ss*2, aiy+ss*4, ss/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.arc(aix+cs/2+ss/2, aiy+cs/2+ss*2, ss*3, -0.25*Math.PI, -0.85*Math.PI, true);
                ctx.closePath();
                ctx.fillStyle = '#4949cc';
                ctx.fill();
                ctx.stroke();
                break;
            case aimax:
                ctx.strokeStyle = '#ff4949';
                ctx.beginPath();
                ctx.arc(aix+cs/2-ss*1.5, aiy+ss*4.5, ss*1.5, 1.25*Math.PI, 0, true);
                ctx.lineTo(aix+cs/2-ss*3, aiy+ss*3);
                ctx.fillStyle = '#ffcccc'
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(aix+cs/2+ss*1.5, aiy+ss*4.5, ss*1.5, -0.25*Math.PI, Math.PI);
                ctx.lineTo(aix+cs/2+ss*3, aiy+ss*3);
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(aix+cs/2-ss, aiy+ss*5, ss/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fillStyle = '#ff4949';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(aix+cs/2+ss, aiy+ss*5, ss/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.arc(aix+cs/2, aiy, cs/2, 0.35*Math.PI, 0.65*Math.PI);
                ctx.stroke();
                break;
            default:
                ctx.strokeStyle = '#cccc00';
                ctx.beginPath();
                ctx.arc(aix+cs/2-ss*1.5, aiy+ss*4.5, ss*1.5, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fillStyle = '#ffffcc';
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(aix+cs/2+ss*1.5, aiy+ss*4.5, ss*1.5, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(aix+cs/2-ss*1.5, aiy+ss*4.5, ss/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fillStyle = '#cccc00';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(aix+cs/2+ss*1.5, aiy+ss*4.5, ss/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(aix+cs/2-ss*2, aiy+cs/2);
                ctx.lineTo(aix+cs/2+ss*2, aiy+cs/2);
                ctx.stroke();
        }
    }
}

//
// ---------------------------------------------------------------------------
var game_over = false;
wnd.addEventListener("click", handle_click);
