var ailvl, aix, aiy, bc, bs, cc, cs, fs, fx1, fx2, fy1, fy2, go, gs, rs, ss;
var aimax = 2;
var aimin = 0;
var clro = "#0000ff";
var clrx = "#ff0000";
var gmax = 12;
var gmin = 3;
var wnd = document.getElementById("main");
var ctx = wnd.getContext('2d');

//
// ---------------------------------------------------------------------------
function ai_turn()
{
    function put(cell) {
        cell.st = 2;
        draw_o(cell);
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
        var choice = minimax(p, 1, 0);
        if (choice < 10) put(cc[choice%3][Math.floor(choice/3)]);
        return;
    }

    if (ailvl == 1) {
        var s = [];
        var t1, t2, t3, t4;
        for (var i = 0; i < gs; i++) {
            t1 = [];
            t2 = [];
            for (var j = 0; j < gs; j++) {
                t1[j] = cc[j][i];
                t2[j] = cc[i][j];
            }
            s.push(t1, t2);
            if ((i+1) < rs) continue;
            t1 = [];
            t2 = [];
            if ((i+1) != gs) {
                t3 = [];
                t4 = [];
            }
            for (var j = 0; j < (i+1); j++) {
                t1[j] = cc[j][i-j];
                t2[j] = cc[j][gs-i+j-1];
                if ((i+1) != gs) {
                    t3[j] = cc[gs-j-1][i-j];
                    t4[j] = cc[gs-j-1][gs-i+j-1];
                }
            }
            s.push(t1, t2);
            if ((i+1) != gs) s.push(t3, t4);
        }
        var mf = null;
        s.forEach(function(ln) {
            if (mf !== null) return;
            var c2 = 0;
            var cx = null;
            for (var i = 0; i < ln.length; i++) {
                switch (ln[i].st) {
                    case 0:
                        if (cx === null) c2++;
                        else c2 = 1;
                        cx = ln[i];
                        break;
                    case 1:
                        c2 = 0;
                        cx = null;
                        break;
                    case 2:
                        c2++;
                        break;
                    default:
                        console.error('ln[i].st='+ln[i].st);
                }
                if (c2 >= rs) {
                    mf = cx;
                    break;
                }
            }
        });
        var m2f = null;
        if (mf === null) {
            s.forEach(function(ln) {
                if (mf !== null) return;
                var c1 = 0;
                var cx = null;
                var so = null;
                for (var i = 0; i < ln.length; i++) {
                    switch (ln[i].st) {
                        case 0:
                            if (cx === null) c1++;
                            else {
                                if ((so !== null) && (c1 == (rs-1))) m2f = so;
                                c1 = 1;
                            }
                            if (c1 == 1) so = ln[i];
                            cx = ln[i];
                            break;
                        case 1:
                            c1++;
                            break;
                        case 2:
                            c1 = 0;
                            cx = null;
                            so = null;
                            break;
                        default:
                            console.error('ln[i].st='+ln[i].st);
                    }
                    if (c1 >= rs) {
                        mf = cx;
                        break;
                    }
                }
            });
        }
        if (mf !== null) {
            put(mf);
            return;
        } else if (m2f !== null) {
            put(m2f);
            return;
        }
    }

    var f = [];
    for (var x = 0; x < gs; x++) {
        for (var y = 0; y < gs; y++) {
            if (cc[x][y].st == 0) f.push(cc[x][y]);
        }
    }
    if (f.length > 0) put(f[Math.floor(Math.random() * f.length)]);
}

//
// ---------------------------------------------------------------------------
function dec_grid()
{
    if (gs > gmin) {
        gs--;
        set_rs();
        set_coords();
        reset();
        if (gs == gmin) draw_button(5);
        if (gs == (gmax-1)) draw_button(3);
        // FIXME: fix AI
        if (gs <= 3) {
            aimax = 2;
            draw_button(0);
            draw_button(1);
            draw_button(2);
        }
    }
}

//
// ---------------------------------------------------------------------------
function draw()
{
    draw_buttons();
    draw_grid();
}

//
// ---------------------------------------------------------------------------
function draw_button(id)
{
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bc[id].x, bc[id].y, bs, bs);

    if (id == 0) {
        ctx.lineWidth = ss;
        ctx.strokeStyle = ailvl < aimax ? '#990000' : '#999999';
        ctx.fillStyle = ailvl < aimax ? '#ff6666' : '#cccccc';
        roundRect(bc[0].x+ss, bc[0].y+ss, bs-ss*2, bs-ss*2, ss*2, true);
        ctx.lineWidth = ss*2;
        ctx.beginPath();
        ctx.moveTo(bc[0].x+ss*4, bc[0].y+bs/2);
        ctx.lineTo(bc[0].x+bs-ss*4, bc[0].y+bs/2);
        ctx.moveTo(bc[0].x+bs/2, bc[0].y+ss*4);
        ctx.lineTo(bc[0].x+bs/2, bc[0].y+bs-ss*4);
        ctx.stroke();
        return;
    }

    if (id == 1) {
        ctx.lineWidth = ss;
        ctx.strokeStyle = '#999999';
        roundRect(aix+ss*2, aiy+ss, bs-ss*4, bs/2+ss*2, ss*2);
        ctx.strokeRect(aix+bs/2-ss*2, aiy+bs/2+ss*3, ss*4, ss*2);
        ctx.strokeRect(aix+ss*4, aiy+bs/2+ss*5, bs-ss*8, ss*2);
        switch (ailvl) {
             case 0: ctx.fillStyle = '#9999ff'; break;
             case 1: ctx.fillStyle = '#ffff99'; break;
             case 2: ctx.fillStyle = '#ff9999'; break;
            default: console.error('ailvl='+ailvl);
        }
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = ss/2;
        roundRect(aix+ss*3, aiy+ss*2, bs-ss*6, bs/2, ss, true);
        switch (ailvl) {
            case 0:
                ctx.strokeStyle = '#6666ff';
                ctx.beginPath();
                ctx.arc(aix+bs/2-ss*1.5, aiy+ss*4.5, ss*1.5, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fillStyle = '#ccccff';
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(aix+bs/2+ss*1.5, aiy+ss*4.5, ss*1.5, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(aix+bs/2-ss*2, aiy+ss*5, ss/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fillStyle = '#6666ff';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(aix+bs/2+ss*2, aiy+ss*4, ss/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.arc(aix+bs/2+ss/2, aiy+bs/2+ss*2, ss*3, -0.25*Math.PI, -0.85*Math.PI, true);
                ctx.closePath();
                ctx.fillStyle = '#4949cc';
                ctx.fill();
                ctx.stroke();
                break;
            case 1:
                ctx.strokeStyle = '#cccc00';
                ctx.beginPath();
                ctx.arc(aix+bs/2-ss*1.5, aiy+ss*4.5, ss*1.5, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fillStyle = '#ffffcc';
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(aix+bs/2+ss*1.5, aiy+ss*4.5, ss*1.5, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(aix+bs/2-ss*1.5, aiy+ss*4.5, ss/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fillStyle = '#cccc00';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(aix+bs/2+ss*1.5, aiy+ss*4.5, ss/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(aix+bs/2-ss*2, aiy+bs/2);
                ctx.lineTo(aix+bs/2+ss*2, aiy+bs/2);
                ctx.stroke();
                break;
            case 2:
                ctx.strokeStyle = '#ff4949';
                ctx.beginPath();
                ctx.arc(aix+bs/2-ss*1.5, aiy+ss*4.5, ss*1.5, 1.25*Math.PI, 0, true);
                ctx.lineTo(aix+bs/2-ss*3, aiy+ss*3);
                ctx.fillStyle = '#ffcccc'
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(aix+bs/2+ss*1.5, aiy+ss*4.5, ss*1.5, -0.25*Math.PI, Math.PI);
                ctx.lineTo(aix+bs/2+ss*3, aiy+ss*3);
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(aix+bs/2-ss, aiy+ss*5, ss/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fillStyle = '#ff4949';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(aix+bs/2+ss, aiy+ss*5, ss/2, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.arc(aix+bs/2, aiy, bs/2, 0.35*Math.PI, 0.65*Math.PI);
                ctx.stroke();
                break;
            default:
                console.error('ailvl='+ailvl);
        }
        return;
    }

    if (id == 2) {
        ctx.lineWidth = ss;
        ctx.strokeStyle = ailvl > aimin ? '#0000ff' : '#999999';
        ctx.fillStyle = ailvl > aimin ? '#6666ff' : '#cccccc';
        roundRect(bc[2].x+ss, bc[2].y+ss, bs-ss*2, bs-ss*2, ss*2, true);
        ctx.lineWidth = ss*2;
        ctx.beginPath();
        ctx.moveTo(bc[2].x+ss*4, bc[2].y+bs/2);
        ctx.lineTo(bc[2].x+bs-ss*4, bc[2].y+bs/2);
        ctx.stroke();
        return;
    }

    if (id == 3) {
        ctx.lineWidth = ss;
        ctx.strokeStyle = gs < gmax ? '#009900' : '#999999';
        ctx.fillStyle = gs < gmax ? '#66ff66' : '#cccccc';
        roundRect(bc[3].x+ss, bc[3].y+ss, bs-ss*2, bs-ss*2, ss*2, true);
        ctx.strokeRect(bc[3].x+bs/2-ss*2, bc[3].y+bs/2-ss*2, ss*4, ss*4);
        ctx.fillStyle = gs < gmax ? '#009900' : '#999999';
        ctx.fillRect(bc[3].x+bs/2-ss*1.5, bc[3].y+bs/2-ss*5, ss*3, ss*2);
        ctx.beginPath();
        ctx.moveTo(bc[3].x+bs/2, bc[3].y+ss*2);
        ctx.lineTo(bc[3].x+bs/2-ss*3, bc[3].y+ss*4);
        ctx.lineTo(bc[3].x+bs/2+ss*3, bc[3].y+ss*4);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(bc[3].x+bs-ss*5, bc[3].y+bs/2-ss*1.5, ss*2, ss*3);
        ctx.beginPath();
        ctx.moveTo(bc[3].x+bs-ss*2, bc[3].y+bs/2);
        ctx.lineTo(bc[3].x+bs/2+ss*4, bc[3].y+bs/2-ss*3);
        ctx.lineTo(bc[3].x+bs/2+ss*4, bc[3].y+bs/2+ss*3);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(bc[3].x+bs/2-ss*1.5, bc[3].y+bs-ss*5, ss*3, ss*2);
        ctx.beginPath();
        ctx.moveTo(bc[3].x+bs/2, bc[3].y+bs-ss*2);
        ctx.lineTo(bc[3].x+bs/2-ss*3, bc[3].y+bs-ss*4);
        ctx.lineTo(bc[3].x+bs/2+ss*3, bc[3].y+bs-ss*4);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(bc[3].x+bs/2-ss*5, bc[3].y+bs/2-ss*1.5, ss*2, ss*3);
        ctx.beginPath();
        ctx.moveTo(bc[3].x+ss*2, bc[3].y+bs/2);
        ctx.lineTo(bc[3].x+bs/2-ss*4, bc[3].y+bs/2-ss*3);
        ctx.lineTo(bc[3].x+bs/2-ss*4, bc[3].y+bs/2+ss*3);
        ctx.closePath();
        ctx.fill();
        return;
    }

    if (id == 4) {
        ctx.lineWidth = ss;
        ctx.strokeStyle = '#009900';
        ctx.fillStyle = '#66ff66';
        roundRect(bc[4].x+ss, bc[4].y+ss, bs-ss*2, bs-ss*2, ss*2, true);
        ctx.lineWidth = ss*2;
        ctx.beginPath();
        ctx.arc(bc[4].x+bs/2, bc[4].y+bs/2, bs/2-ss*4, 0.125*Math.PI, 1.75*Math.PI);
        ctx.moveTo(bc[4].x+bs-ss*5, bc[4].y+bs/2-ss);
        ctx.lineTo(bc[4].x+bs-ss*4, bc[4].y+bs/2-ss);
        ctx.lineTo(bc[4].x+bs-ss*4, bc[4].y+bs/2-ss*2);
        ctx.closePath();
        ctx.stroke();
        return;
    }

    if (id == 5) {
        ctx.lineWidth = ss;
        ctx.strokeStyle = gs > gmin ? '#009900' : '#999999';
        ctx.fillStyle = gs > gmin ? '#66ff66' : '#cccccc';
        roundRect(bc[5].x+ss, bc[5].y+ss, bs-ss*2, bs-ss*2, ss*2, true);
        ctx.strokeRect(bc[5].x+bs/2-ss*2, bc[5].y+bs/2-ss*2, ss*4, ss*4);
        ctx.fillStyle = gs > gmin ? '#009900' : '#999999';
        ctx.fillRect(bc[5].x+bs/2-ss*1.5, bc[5].y+ss*2, ss*3, ss*2);
        ctx.beginPath();
        ctx.moveTo(bc[5].x+bs/2, bc[5].y+ss*5);
        ctx.lineTo(bc[5].x+bs/2-ss*3, bc[5].y+ss*3);
        ctx.lineTo(bc[5].x+bs/2+ss*3, bc[5].y+ss*3);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(bc[5].x+bs-ss*4, bc[5].y+bs/2-ss*1.5, ss*2, ss*3);
        ctx.beginPath();
        ctx.moveTo(bc[5].x+bs-ss*5, bc[5].y+bs/2);
        ctx.lineTo(bc[5].x+bs/2+ss*5, bc[5].y+bs/2-ss*3);
        ctx.lineTo(bc[5].x+bs/2+ss*5, bc[5].y+bs/2+ss*3);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(bc[5].x+bs/2-ss*1.5, bc[5].y+bs-ss*4, ss*3, ss*2);
        ctx.beginPath();
        ctx.moveTo(bc[5].x+bs/2, bc[5].y+bs-ss*5);
        ctx.lineTo(bc[5].x+bs/2-ss*3, bc[5].y+bs-ss*3);
        ctx.lineTo(bc[5].x+bs/2+ss*3, bc[5].y+bs-ss*3);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(bc[5].x+ss*2, bc[5].y+bs/2-ss*1.5, ss*2, ss*3);
        ctx.beginPath();
        ctx.moveTo(bc[5].x+ss*5, bc[5].y+bs/2);
        ctx.lineTo(bc[5].x+bs/2-ss*5, bc[5].y+bs/2-ss*3);
        ctx.lineTo(bc[5].x+bs/2-ss*5, bc[5].y+bs/2+ss*3);
        ctx.closePath();
        ctx.fill();
        return;
    }

    console.error('id='+id);
}

//
// ---------------------------------------------------------------------------
function draw_buttons()
{
    for (var i = 0; i < bc.length; i++) draw_button(i);
}

//
// ---------------------------------------------------------------------------
function draw_grid()
{
    ctx.fillStyle='#ffffff';
    ctx.fillRect(fx1-ss/2, fy1-ss/2, fs+ss, fs+ss);
    ctx.fillStyle='#000000';
    for (var i = 0; i < (gs-1); i++) {
        ctx.fillRect(cc[i][0].x2, fy1, ss, fs);
        ctx.fillRect(fx1, cc[0][i].y2, fs, ss);
    }
    for (var y = 0; y < gs; y++) {
        for (var x = 0; x < gs; x++) {
            if (cc[x][y].st == 1) draw_x(x, y);
            else if (cc[x][y].st == 2) draw_o(cc[x][y]);
        }
    }
    if (go) strike_all();
}

//
// ---------------------------------------------------------------------------
function draw_o(cell)
{
    ctx.beginPath();
    ctx.arc(cell.x1+cs/2, cell.y1+cs/2, cs/2-ss, 0, 2*Math.PI);
    ctx.closePath();
    ctx.strokeStyle = clro;
    ctx.lineWidth = ss;
    ctx.stroke();
}

//
// ---------------------------------------------------------------------------
function draw_x(x, y)
{
    ctx.beginPath();
    ctx.moveTo(cc[x][y].x1+ss, cc[x][y].y1+ss);
    ctx.lineTo(cc[x][y].x2-ss, cc[x][y].y2-ss);
    ctx.moveTo(cc[x][y].x1+ss, cc[x][y].y2-ss);
    ctx.lineTo(cc[x][y].x2-ss, cc[x][y].y1+ss);
    ctx.strokeStyle = clrx;
    ctx.lineWidth = ss;
    ctx.lineCap = 'round';
    ctx.stroke();
}

//
// ---------------------------------------------------------------------------
function fit_canvas()
{
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

//
// ---------------------------------------------------------------------------
function handle_click(event)
{
    var x = event.clientX - ctx.canvas.getBoundingClientRect().left;
    var y = event.clientY - ctx.canvas.getBoundingClientRect().top;
    if ((x >= fx1) && (x <= fx2) && (y >= fy1) && (y <= fy2))
    {
        if (!go)
        {
            for (var i = 0; i < gs; i++)
            {
                if (x < cc[i][0].x1) break;
                if (x > cc[i][0].x2) continue;
                for (var j = 0; j < gs; j++)
                {
                    if (y < cc[0][j].y1) break;
                    if (y > cc[0][j].y2) continue;
                    if (cc[i][j].st == 0)
                    {
                        cc[i][j].st = 1;
                        draw_x(i, j);
                        if (is_go()) {
                            strike_all();
                            return;
                        }
                        ai_turn();
                        if (is_go()) {
                            strike_all();
                            return;
                        }
                    }
                }
            }
        }
    } else {
        bc.forEach(function(v, i) {
            if ((x >= v.x) && (x <= v.x+bs)) {
                if ((y >= v.y) && (y <= v.y+bs)) {
                    switch (i) {
                        case 0: set_ai(ailvl+1); break;
                        case 1: break;
                        case 2: set_ai(ailvl-1); break;
                        case 3: inc_grid(); break;
                        case 4: reset(); break;
                        case 5: dec_grid(); break;
                       default: console.error('i='+i);
                    }
                }
            }
        });
    }
}

//
// ---------------------------------------------------------------------------
function inc_grid()
{
    if (gs < gmax) {
        gs++;
        set_rs();
        set_coords();
        reset();
        if (gs == gmax) draw_button(3);
        if (gs == (gmin+1)) draw_button(5);
        // FIXME: fix AI
        if (gs > 3) {
            aimax = 1;
            if (ailvl > aimax) ailvl = aimax;
            draw_button(0);
            draw_button(1);
            draw_button(2);
        }
    }
}

//
// ---------------------------------------------------------------------------
function init()
{
    ailvl = 1;
    go = false;
    gs = 3;
    rs = 3;
    fit_canvas();
    set_coords();
}

//
// ---------------------------------------------------------------------------
function is_go()
{
    if (!go) {
        for (var y = 0; y < gs; y++) {
            var il = 0;
            var is = cc[0][y].st;
            for (var x = 0; x < gs; x++) {
                if (cc[x][y].st == is) il++;
                else {
                    if ((is != 0) && (il >= rs)) break;
                    il = 1;
                    is = cc[x][y].st;
                }
            }
            if ((is != 0) && (il >= rs)) {
                go = true;
                return go;
            }
        }
        for (var x = 0; x < gs; x++) {
            var il = 0;
            var is = cc[x][0].st;
            for (var y = 0; y < gs; y++) {
                if (cc[x][y].st == is) il++;
                else {
                    if ((is != 0) && (il >= rs)) break;
                    il = 1;
                    is = cc[x][y].st;
                }
            }
            if ((is != 0) && (il >= rs)) {
                go = true;
                return go;
            }
        }
        for (var i = 0; i < gs; i++) {
            if ((i+1) < rs) continue;
            var j1 = 0;
            var j2 = 0;
            var l1 = 0;
            var l2 = 0;
            var s1 = cc[0][i].st;
            var s2 = cc[gs-1][gs-i-1].st;
            for (var j = 0; j < (i+1); j++) {
                if (cc[j][i-j].st == s1) l1++;
                else {
                    if ((s1 != 0) && (l1 >= rs)) break;
                    l1 = 1;
                    s1 = cc[j][i-j].st;
                    j1 = j;
                }
                if (cc[gs-j-1][gs-i+j-1].st == s2) l2++;
                else {
                    if ((s2 != 0) && (l2 >= rs)) break;
                    l2 = 1;
                    s2 = cc[gs-j-1][gs-i+j-1].st;
                    j2 = j;
                }
            }
            if ((s1 != 0) && (l1 >= rs)) {
                go = true;
                return go;
            }
            if ((s2 != 0) && (l2 >= rs)) {
                go = true;
                return go;
            }
        }
        for (var i = 0; i < gs; i++) {
            if ((i+1) < rs) continue;
            var j1 = 0;
            var j2 = 0;
            var l1 = 0;
            var l2 = 0;
            var s1 = cc[0][gs-i-1].st;
            var s2 = cc[gs-1][i].st;
            for (var j = 0; j < (i+1); j++) {
                if (cc[j][gs-i+j-1].st == s1) l1++;
                else {
                    if ((s1 != 0) && (l1 >= rs)) break;
                    l1 = 1;
                    s1 = cc[j][gs-i+j-1].st;
                    j1 = j;
                }
                if (cc[gs-j-1][i-j].st == s2) l2++;
                else {
                    if ((s2 != 0) && (l2 >= rs)) break;
                    l2 = 1;
                    s2 = cc[gs-j-1][i-j].st;
                    j2 = j;
                }
            }
            if ((s1 != 0) && (l1 >= rs)) {
                go = true;
                return go;
            }
            if ((s2 != 0) && (l2 >= rs)) {
                go = true;
                return go;
            }
        }
    }
    return go;
}

//
// ---------------------------------------------------------------------------
function reset()
{
    go = false;
    for (var x = 0; x < gs; x++) {
        for (var y = 0; y < gs; y++) {
            cc[x][y].st = 0;
        }
    }
    draw_grid();
}

//
// ---------------------------------------------------------------------------
function resize()
{
    fit_canvas();
    set_coords();
    draw();
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
    if ((lvl >= aimin) && (lvl <= aimax) && (lvl != ailvl)) {
        var f = ailvl;
        ailvl = lvl;
        draw_button(1);
        if ((lvl == aimax) || (aimax == f)) draw_button(0);
        if ((lvl == aimin) || (aimin == f)) draw_button(2);
    }
}

//
// ---------------------------------------------------------------------------
function set_coords()
{
    if (wnd.width < wnd.height) {
        fs = (wnd.height/5 < wnd.width/3 ? wnd.height/5*3 : wnd.width) * 0.9;
    } else {
        fs = (wnd.width/5 < wnd.height/3 ? wnd.width/5*3 : wnd.height) * 0.9;
    }

    ss = fs * 0.02;
    bs = (fs - ss*2) / 3;
    cs = (fs - ss*(gs-1)) / gs;
    fx1 = (wnd.width - fs) / 2;
    fy1 = (wnd.height - fs) / 2;
    fx2 = fx1 + fs;
    fy2 = fy1 + fs;

    var nr = true;
    if (typeof cc == 'undefined') {
        nr = false;
        cc = [];
    } else if (cc[0].length != gs) nr = false;
    for (var x = 0; x < gs; x++) {
        if (!nr) cc[x] = [];
        for (var y = 0; y < gs; y++) {
            if (!nr) {
                cc[x][y] = {
                    x1: fx1+(cs+ss)*x,
                    y1: fy1+(cs+ss)*y,
                    x2: fx1+(cs+ss)*x+cs,
                    y2: fy1+(cs+ss)*y+cs,
                    st: 0
                };
            } else {
                cc[x][y].x1 = fx1+(cs+ss)*x;
                cc[x][y].y1 = fy1+(cs+ss)*y;
                cc[x][y].x2 = fx1+(cs+ss)*x+cs;
                cc[x][y].y2 = fy1+(cs+ss)*y+cs;
            }
        }
    }

    bc = [];
    for (var i = 0; i < 3; i++) {
        bc[i] = {};
        bc[i].x = wnd.width < wnd.height ? fx1+(bs+ss)*i : fx1-bs-ss;
        bc[i].y = wnd.width < wnd.height ? fy1-bs-ss : fy1+(bs+ss)*i;
        bc[i+3] = {};
        bc[i+3].x = wnd.width < wnd.height ? fx1+(bs+ss)*i : fx2+ss;
        bc[i+3].y = wnd.width < wnd.height ? fy2+ss : fy1+(bs+ss)*i;
    }
    aix = bc[1].x;
    aiy = bc[1].y;
}

//
// ---------------------------------------------------------------------------
function set_rs()
{
    if (gs == 3) rs = 3;
    else if (gs <= 5) rs = 4;
    else if (gs <= 14) rs = 5;
    else rs = 6;
}

//
// ---------------------------------------------------------------------------
function strike_all()
{
    function strike(x1, y1, x2, y2, st) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineCap = 'butt';
        ctx.lineWidth = ss;
        ctx.strokeStyle = st == 1 ? clrx : clro;
        ctx.stroke();
    }

    for (var y = 0; y < gs; y++) {
        var il = 0;
        var is = cc[0][y].st;
        var ix = 0;
        for (var x = 0; x < gs; x++) {
            if (cc[x][y].st == is) il++;
            else {
                if ((is != 0) && (il >= rs)) break;
                il = 1;
                is = cc[x][y].st;
                ix = x;
            }
        }
        if ((is != 0) && (il >= rs)) {
            strike(cc[ix][y].x1, cc[ix][y].y1+cs/2, cc[ix+il-1][y].x2, cc[ix+il-1][y].y1+cs/2, cc[ix][y].st);
            break;
        }
    }
    for (var x = 0; x < gs; x++) {
        var il = 0;
        var is = cc[x][0].st;
        var iy = 0;
        for (var y = 0; y < gs; y++) {
            if (cc[x][y].st == is) il++;
            else {
                if ((is != 0) && (il >= rs)) break;
                il = 1;
                is = cc[x][y].st;
                iy = y;
            }
        }
        if ((is != 0) && (il >= rs)) {
            strike(cc[x][iy].x1+cs/2, cc[x][iy].y1, cc[x][iy+il-1].x1+cs/2, cc[x][iy+il-1].y2, cc[x][iy].st);
            break;
        }
    }
    for (var i = 0; i < gs; i++) {
        if ((i+1) < rs) continue;
        var j1 = 0;
        var j2 = 0;
        var l1 = 0;
        var l2 = 0;
        var s1 = cc[0][i].st;
        var s2 = cc[gs-1][gs-i-1].st;
        for (var j = 0; j < (i+1); j++) {
            if (cc[j][i-j].st == s1) l1++;
            else {
                if ((s1 != 0) && (l1 >= rs)) break;
                l1 = 1;
                s1 = cc[j][i-j].st;
                j1 = j;
            }
            if (cc[gs-j-1][gs-i+j-1].st == s2) l2++;
            else {
                if ((s2 != 0) && (l2 >= rs)) break;
                l2 = 1;
                s2 = cc[gs-j-1][gs-i+j-1].st;
                j2 = j;
            }
        }
        if ((s1 != 0) && (l1 >= rs)) {
            strike(cc[j1][i-j1].x1, cc[j1][i-j1].y2, cc[j1+l1-1][i-j1-l1+1].x2, cc[j1+l1-1][i-j1-l1+1].y1, cc[j1][i-j1].st);
            break;
        }
        if ((s2 != 0) && (l2 >= rs)) {
            strike(cc[gs-j2-1][gs-i+j2-1].x2, cc[gs-j2-1][gs-i+j2-1].y1, cc[gs-j2-l2][gs-i+j2+l2-2].x1, cc[gs-j2-l2][gs-i+j2+l2-2].y2, cc[gs-j2-1][gs-i+j2-1].st);
            break;
        }
    }
    for (var i = 0; i < gs; i++) {
        if ((i+1) < rs) continue;
        var j1 = 0;
        var j2 = 0;
        var l1 = 0;
        var l2 = 0;
        var s1 = cc[0][gs-i-1].st;
        var s2 = cc[gs-1][i].st;
        for (var j = 0; j < (i+1); j++) {
            if (cc[j][gs-i+j-1].st == s1) l1++;
            else {
                if ((s1 != 0) && (l1 >= rs)) break;
                l1 = 1;
                s1 = cc[j][gs-i+j-1].st;
                j1 = j;
            }
            if (cc[gs-j-1][i-j].st == s2) l2++;
            else {
                if ((s2 != 0) && (l2 >= rs)) break;
                l2 = 1;
                s2 = cc[gs-j-1][i-j].st;
                j2 = j;
            }
        }
        if ((s1 != 0) && (l1 >= rs)) {
            strike(cc[j1][gs-i+j1-1].x1, cc[j1][gs-i+j1-1].y1, cc[j1+l1-1][gs-i+j1+l1-2].x2, cc[j1+l1-1][gs-i+j1+l1-2].y2, cc[j1][gs-i+j1-1].st);
            break;
        }
        if ((s2 != 0) && (l2 >= rs)) {
            strike(cc[gs-j2-1][i-j2].x2, cc[gs-j2-1][i-j2].y2, cc[gs-j2-l2][i-j2-l2+1].x1, cc[gs-j2-l2][i-j2-l2+1].y1, cc[gs-j2-1][i-j2].st);
            break;
        }
    }
}

//
// ---------------------------------------------------------------------------
init();
draw();
window.addEventListener("resize", resize);
wnd.addEventListener("click", handle_click);
