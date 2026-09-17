class Col{
    int strength;
    double rating;
    String speciality;

    Col(int strength,double rating,String speciality){
    this.strength=strength;//instead of using different variable
    this.rating=rating;
    this.speciality=speciality;

}
}

// Col Blde( int a,double b,String c){
//     a=1000;
//     b=4.0;
//     c="xyz";


// }

public class College {
    public static void main(String[] args) {
        Col bld = new Col(1000,4.5,"good college");
        
        //  System.out.println(bld.strength);
                 System.out.println(bld);

    }


    
}
