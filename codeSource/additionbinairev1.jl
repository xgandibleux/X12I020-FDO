#= Testez votre aptitude à additionner deux nombres binaires repésentés sur k bits :

   Exercices générés aléatoirement pour s'entrainer à additionner deux nombres binaires 
   représentés sur k bits selon que les nombres soient non-signés ou signés.

   Programme codé en langage julia (www.julialang.org) avec la volonte de rester proche 
   d'une description algorithmique.

   X. Gandibleux - 2021
=#

# ============================================
# Initalisations

function initialise()
    k = rand(2:8)          # tire aleatoirement la valeur de k; precondition : k>=2
    a = rand(0:1,k)        # tire aleatoirement les k valeurs de a dans {0,1}
    b = rand(0:1,k)        # tire aleatoirement les k valeurs de b dans {0,1}
    return k, a, b
end

# ============================================
# Addition de 2 nombres binaires et retenue sur k bits
 
function addition(a::Array{Int64,1},b::Array{Int64,1}) 

    r = zeros(Int64,k)     # initialise le mot destine a contenir les retenues
    s = zeros(Int64,k)     # initialise le mot destine a contenir le resultat
    carry = 0              # indicateur de carry
    overflow = 0           # indicateur de overflow

    retenue = 0; r[end] = 0

    # Realise l'addition etage par etage en demarrant du bit de poids faible 
    for i = reverse(1:length(a)) 
        r[i] = retenue
        if a[i]+b[i]+retenue == 0
            s[i] = 0; retenue = 0 
        elseif a[i]+b[i]+retenue == 1
            s[i] = 1; retenue = 0 
        elseif a[i]+b[i]+retenue == 2
            s[i] = 0; retenue = 1 
        elseif a[i]+b[i]+retenue == 3
            s[i] = 1; retenue = 1    
        end
    end  

    # Leve le drapeau de carry si necessaire
    if retenue == 1
        carry = 1
    end

    # Leve le drapeau de overflow si necessaire
    if a[1]==b[1] && a[1]!=s[1]
        overflow = 1
    end

    return r, s, carry, overflow
end


# ============================================
# conversion de base 2 vers base 10 pour des nombres non signes

function convertionb2b10nonsigne(a::Array{Int64,1})    
    a_base10_nonSigne = a[1]
    for i = 2:length(a)
        a_base10_nonSigne = a_base10_nonSigne * 2 + a[i]     
    end
    return a_base10_nonSigne
end

# =================================================
# conversion de base 2 vers base 10 pour des nombres signes

function convertionb2b10signe(a::Array{Int64,1}) 
    if a[1]==0  
        # nombre >= 0
        a_base10_Signe = convertionb2b10nonsigne(a)
    else
        # nombre < 0
        # complement a 1... ------------------
        a_cpt1 = zeros(Int64,k)
        for i = 1:length(a)
            a_cpt1[i]=(a[i]+1) % 2
        end
        # ...plus 1 --------------------------
        retenue = 1 
        a_cpt2 = zeros(Int64,k)
        for i = reverse(1:length(a_cpt1)) 
            if a_cpt1[i]+retenue == 0
                a_cpt2[i] = 0; retenue = 0 
            elseif a_cpt1[i]+retenue == 1
                a_cpt2[i] = 1; retenue = 0 
            elseif a_cpt1[i]+retenue == 2
                a_cpt2[i] = 0; retenue = 1  
            end 
        end    
        # conversion base 2 vers base 10 -----
        a_base10_Signe = -1 * convertionb2b10nonsigne(a_cpt2) 
    end

    return a_base10_Signe
end  

# ============================================
# ============================================
# point d'entree principal

k, a, b = initialise()
r, s, carry, overflow = addition(a,b)

# ============================================
# Edition des resultats

println("Testez votre fluidité à calculer en binaire :")
println("")
@show k
@show a 
@show b

# --------------------------------------------
println("")
println("1) a+b=??? dans le cas des nombres non-signés :")
println("Pressez CR pour obtenir la solution et la vérification")
wait=readline()
  
println("k = ",k,"  =>  0 ≤ n ≤ ",2^k-1)
@show a
@show b
@show r
@show s
@show carry

println("") 
println("Vérification :")
println("a = ",convertionb2b10nonsigne(a))
println("b = ",convertionb2b10nonsigne(b))
# En cas de carry, le resultat calcule n'est pas representable -> NaN (signifie "n'est pas un nombre")
if carry == 0
    println("s = ",convertionb2b10nonsigne(s))
else 
    println("s = ",NaN)
end

# --------------------------------------------
println("")
println("2) a+b=??? dans le cas des nombres signés :")
println("Pressez CR pour obtenir la solution et la vérification")
wait=readline()

println("k = ",k," =>  ",-2^(k-1)," ≤ n ≤ ",2^(k-1)-1)
@show a
@show b
@show r
@show s
@show overflow

println("") 
println("Vérification :")
println("a = ",convertionb2b10signe(a))
println("b = ",convertionb2b10signe(b))
# En cas d'overflow, le resultat calcule est une aberrant (pas de sens) -> affecter NaN (signifie "n'est pas un nombre")
if overflow == 0
    println("s = ",convertionb2b10signe(s))
else 
    println("s = ",NaN)
end
