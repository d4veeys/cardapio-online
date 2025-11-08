# criar debug.sh
cat > debug.sh << 'EOF'
#!/bin/bash
echo "🔧 DEBUG COSTELA DO TITI"
echo "========================"

# Verificar estrutura
echo "1. 📁 Estrutura de pastas:"
find . -type f -name "*.html" -o -name "*.css" -o -name "*.js" | sort

echo ""
echo "2. 📊 Tamanho dos arquivos:"
ls -la *.html css/*.js js/*.js 2>/dev/null | awk '{print $5 " " $9}'

echo ""
echo "3. 🖼️ Imagens:"
ls -la images/ 2>/dev/null || echo "Pasta images não encontrada"

echo ""
echo "4. 🌐 Testar servidor:"
echo "   Execute: python3 -m http.server 8000"
echo "   Ou: npx http-server -p 3000"
echo "   Acesse: http://localhost:8000"

EOF

chmod +x debug.sh
./debug.sh